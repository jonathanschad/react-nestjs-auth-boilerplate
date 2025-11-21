//
//  RoundLogView.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import SwiftUI

struct RoundLogView: View {
    @ObservedObject var player1: GamePlayer
    @ObservedObject var player2: GamePlayer
    @ObservedObject var gameViewModel: GameViewModel
    let currentPlayerIndex: Int
    
    @State private var showingUndoConfirmation = false
    
    private var maxRounds: Int {
        max(player1.rounds.count, player2.rounds.count)
    }
    
    private var canUndo: Bool {
        player1.rounds.count > 0 || player2.rounds.count > 0
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignSystem.Spacing.md) {
            RoundHeader(
                totalRounds: maxRounds,
                canUndo: canUndo,
                onUndo: { showingUndoConfirmation = true }
            )
            
            // Rounds Grid
            ScrollView {
                LazyVStack(spacing: DesignSystem.Spacing.sm) {
                    if maxRounds == 0 {
                        EmptyRoundState()
                    } else {
                        // Rounds
                        ForEach(0..<maxRounds, id: \.self) { roundIndex in
                            let reversedIndex = maxRounds - 1 - roundIndex
                            
                            HStack(spacing: DesignSystem.Spacing.sm) {
                                // Player 1 Round
                                RoundItemView(
                                    round: reversedIndex < player1.rounds.count ? player1.rounds[reversedIndex] : nil,
                                    color: DesignSystem.Colors.accent,
                                    roundNumber: reversedIndex + 1
                                )
                                
                                // Divider
                                Rectangle()
                                    .fill(DesignSystem.Colors.systemGray4)
                                    .frame(width: DesignSystem.Sizes.dividerWidth)
                                    .padding(.vertical, DesignSystem.Spacing.xxs)
                                
                                // Player 2 Round
                                RoundItemView(
                                    round: reversedIndex < player2.rounds.count ? player2.rounds[reversedIndex] : nil,
                                    color: DesignSystem.Colors.error,
                                    roundNumber: reversedIndex + 1
                                )
                            }
                        }
                    }
                }
                .padding(.vertical, DesignSystem.Spacing.sm)
            }
            .frame(maxHeight: .infinity)
        }
        .padding(DesignSystem.Spacing.lg)
        .background(
            RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                .fill(DesignSystem.Colors.systemBackground)
                .overlay(
                    RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                        .stroke(DesignSystem.Colors.systemGray4, lineWidth: DesignSystem.BorderWidth.regular)
                )
                .shadow(color: .black.opacity(0.04), radius: 6, x: 0, y: 2)
        )
        .alert("Letzten Wurf rückgängig machen?", isPresented: $showingUndoConfirmation) {
            Button("Abbrechen", role: .cancel) {
                showingUndoConfirmation = false
            }
            Button("Rückgängig machen", role: .destructive) {
                gameViewModel.undoLastRound()
            }
        } message: {
            Text("Möchten Sie den letzten Wurf wirklich rückgängig machen?")
        }
    }
}

#Preview {
    let player1 = Player(name: "Max")
    let player2 = Player(name: "Anna")
    let gamePlayer1 = GamePlayer(player: player1, startingScore: 501)
    let gamePlayer2 = GamePlayer(player: player2, startingScore: 501)
    
    // Add sample rounds
    gamePlayer1.rounds = [
        DartRound(dartThrows: [
            DartThrow(number: 20, multiplier: .triple),
            DartThrow(number: 20, multiplier: .triple),
            DartThrow(number: 20, multiplier: .triple)
        ]),
        DartRound(dartThrows: [
            DartThrow(number: 19, multiplier: .triple),
            DartThrow(number: 19, multiplier: .triple),
            DartThrow(number: 7, multiplier: .single)
        ])
    ]
    
    gamePlayer2.rounds = [
        DartRound(dartThrows: [
            DartThrow(number: 20, multiplier: .triple),
            DartThrow(number: 20, multiplier: .single),
            DartThrow(number: 20, multiplier: .single)
        ])
    ]
    
    var gameSettings = GameSettings()
    gameSettings.player1 = player1
    gameSettings.player2 = player2
    let viewModel = GameViewModel(gameSettings: gameSettings)
    
    return RoundLogView(
        player1: gamePlayer1,
        player2: gamePlayer2,
        gameViewModel: viewModel,
        currentPlayerIndex: 0
    )
    .standardPadding()
    .standardBackground()
} 
