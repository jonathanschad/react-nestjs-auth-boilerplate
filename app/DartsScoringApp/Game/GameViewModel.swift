//
//  GameViewModel.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import Foundation
import SwiftUI
import Combine

// MARK: - Game ViewModel

//@MainActor
class GameViewModel: ObservableObject {
    @Published var player1: GamePlayer
    @Published var player2: GamePlayer
    @Published var currentPlayerIndex: Int = 0

    // MARK: - Game State

    let gameId: UUID = UUID() // Unique ID for this game session
    @Published var gameState: GameState = .playing
    @Published var selectedMultiplier: DartMultiplier = .single
    @Published var showingGameFinished: Bool = false
    @Published var currentThrowInTurn: Int = 0
    @Published var isSubmittingResult: Bool = false
    @Published var submitError: Error?

    // Navigation actions - triggered by UI, handled by coordinator
    @Published var shouldEndGame = false
    @Published var shouldShowStats = false

    let gameSettings: GameSettings
    private let soundManager = SoundManager.shared
    private let gameRepository = GameRepository.shared

    var currentPlayer: GamePlayer {
        return currentPlayerIndex == 0 ? player1 : player2
    }

    var otherPlayer: GamePlayer {
        return currentPlayerIndex == 0 ? player2 : player1
    }

    var isLastThrowInTurn: Bool {
        return currentThrowInTurn == 2
    }

    init(gameSettings: GameSettings) {
        // Create a deep copy of the settings to ensure stability
        var settings = GameSettings()
        settings.player1 = gameSettings.player1
        settings.player2 = gameSettings.player2
        settings.gameMode = gameSettings.gameMode
        settings.startingPoints = gameSettings.startingPoints
        
        self.gameSettings = settings
        self.player1 = GamePlayer(
            player: settings.player1!,
            startingScore: settings.startingPoints.rawValue
        )
        self.player2 = GamePlayer(
            player: settings.player2!,
            startingScore: settings.startingPoints.rawValue
        )

        // Play game on sound when starting
        DispatchQueue.main.async {
            self.soundManager.playGameOnSound()
        }
    }

    // MARK: - Game Actions

    func makeThrow(_ number: Int) {
        guard case .playing = gameState else { return }
        guard number > 0 else { return } // do not allow negative numbers
        guard number <= 20 || number == 25 else { return } // Do not allow numbers above 20, except singel bull
        guard !(number == 25 && selectedMultiplier == .triple) else { return } // Do not allow to combine single bull with triple

        let dartThrow = DartThrow(number: number, multiplier: selectedMultiplier)

        // Check if throw is valid
        if !currentPlayer.canMakeThrow(dartThrow, gameMode: gameSettings.gameMode) {
            // Invalid throw (bust or invalid finish) - count as a throw but don't apply score
            clearCurrentRound()
            makeNoScore()

            return
        }

        // Valid throw
        currentPlayer.addThrow(dartThrow)
        currentThrowInTurn += 1

        // Check for win condition
        if currentPlayer.hasWon {
            gameState = .finished(winner: currentPlayer.player)
            soundManager.playFinishSound()
            showingGameFinished = true
            return
        }

        // Check if turn is complete
        if currentThrowInTurn >= 3 {
            finishTurn()
        }

        // Reset multiplier to single after each throw
        selectedMultiplier = .single
    }

    func makeMiss() {
        guard case .playing = gameState else { return }

        let dartThrow = DartThrow(number: 0, multiplier: .single)
        currentPlayer.addThrow(dartThrow)

        currentThrowInTurn += 1

        if currentThrowInTurn >= 3 {
            finishTurn()
        }

        // Reset multiplier to single
        selectedMultiplier = .single
    }

    func makeNoScore() {
        guard case .playing = gameState else { return }


        clearCurrentRound()

        let dartThrow = DartThrow(number: 0, multiplier: .single)
        currentPlayer.addThrow(dartThrow)
        currentPlayer.addThrow(dartThrow)
        currentPlayer.addThrow(dartThrow)

        currentThrowInTurn = 3
        finishTurn()

        // Reset multiplier to single
        selectedMultiplier = .single
    }

    func clearCurrentRound() {
        guard case .playing = gameState else { return }
        guard currentThrowInTurn > 0 else { return }

        // Remove the throws from current round from player's total throws
        let throwsToRemove = currentPlayer.currentRoundThrows.count
        if throwsToRemove > 0 {
            // Restore the score from current round throws
            let scoreToRestore = currentPlayer.currentRoundThrows.reduce(0) { sum, dartThrow in
                sum + dartThrow.score
            }
            currentPlayer.currentScore += scoreToRestore

            // Remove throws from the end of dartThrows array
            currentPlayer.dartThrows.removeLast(throwsToRemove)

            // Clear current round throws
            currentPlayer.currentRoundThrows.removeAll()
        }

        // Reset throw counter
        currentThrowInTurn = 0

        // Reset multiplier to single
        selectedMultiplier = .single
    }

    private func finishTurn() {
        // Runde für aktuellen Spieler abschließen
        currentPlayer.finishRound()

        // Berechne den Score für die komplette Runde und spiele Sound
        let roundScore = currentPlayer.rounds.last?.totalScore ?? 0
        if roundScore >= 0 {
            soundManager.playScoreSound(score: roundScore)
        }

        currentThrowInTurn = 0
        switchPlayer()
    }

    func undoLastRound() {
        let previousScore = otherPlayer.rounds.last?.totalScore ?? 0
        otherPlayer.rounds.removeLast()
        otherPlayer.dartThrows.removeLast()
        otherPlayer.dartThrows.removeLast()
        otherPlayer.dartThrows.removeLast()
        otherPlayer.currentScore += previousScore
        self.switchPlayer()
    }

    private func switchPlayer() {
        currentPlayerIndex = currentPlayerIndex == 0 ? 1 : 0
    }

    // MARK: - Starting Player

    func switchStartingPlayer() {
        // Nur erlaubt wenn noch kein Wurf gemacht wurde
        guard currentThrowInTurn == 0 && player1.dartThrows.isEmpty && player2.dartThrows.isEmpty else { return }
        switchPlayer()
    }

    func setMultiplier(_ multiplier: DartMultiplier) {
        selectedMultiplier = multiplier
    }

    func resetGame() {
        player1 = GamePlayer(
            player: gameSettings.player1!,
            startingScore: gameSettings.startingPoints.rawValue
        )
        player2 = GamePlayer(
            player: gameSettings.player2!,
            startingScore: gameSettings.startingPoints.rawValue
        )
        currentPlayerIndex = 0
        currentThrowInTurn = 0
        gameState = .playing
        selectedMultiplier = .single
        showingGameFinished = false
    }

    // MARK: - Navigation Actions

    func requestEndGame() {
        shouldEndGame = true
    }

    func requestShowStats() {
        shouldShowStats = true
    }

    func resetNavigationFlags() {
        shouldEndGame = false
        shouldShowStats = false
    }

    // MARK: - Helper Methods

    func getRecentThrows(for player: GamePlayer, count: Int = 10) -> [DartThrow] {
        return Array(player.dartThrows.suffix(count).reversed())
    }

    internal func submitGameResult() {
        guard case .finished(let winner) = gameState else { return }

        isSubmittingResult = true
        submitError = nil

        Task {
            do {
                try await gameRepository.submitGameResult(
                    gameId: gameId,
                    playerA: player1,
                    playerB: player2,
                    winner: winner
                )
                print("✅ Game result submitted successfully")
            } catch {
                print("❌ Failed to submit game result: \(error)")
                submitError = error
            }
            isSubmittingResult = false
        }
    }
}
