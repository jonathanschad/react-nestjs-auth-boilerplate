//
//  GameSetupViewModel.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import Foundation
import SwiftUI

@MainActor
class GameSetupViewModel: ObservableObject {
    @Published var gameSettings = GameSettings()
    @Published var players: [Player] = []
    @Published var newPlayerName = ""
    @Published var selectedPlayerImage = "person.fill"
    @Published var selectedSortOption: Player.SortOption = .name {
        didSet {
            Task {
                await loadPlayers()
            }
        }
    }
    @Published var isLoading = false
    @Published var error: Error?
    @Published var showIntroView = false
    @Published var gamePreview: GamePreviewResponse?
    @Published var isLoadingPreview = false

    private let navigationCoordinator: NavigationCoordinator
    private let playerRepository = PlayerRepository.shared
    private let apiClient = APIClient.shared
    
    let availablePlayerImages = [
        "person.fill",
        "person.circle.fill",
        "person.crop.circle.fill",
        "person.crop.circle.fill.badge.checkmark",
        "person.crop.circle.fill.badge.plus",
        "person.crop.circle.fill.badge.xmark",
        "person.2.fill",
        "person.3.fill",
        "person.fill.checkmark",
        "person.fill.xmark",
        "person.fill.questionmark",
        "person.fill.badge.plus",
        "person.fill.badge.minus",
        "person.fill.turn.right",
        "person.fill.turn.left",
        "person.fill.viewfinder",
        "person.crop.square.fill",
        "person.crop.artframe",
        "person.text.rectangle.fill",
        "person.wave.2.fill"
    ]
    
    init(navigationCoordinator: NavigationCoordinator) {
        self.navigationCoordinator = navigationCoordinator
        Task {
            await loadPlayers()
        }
    }
    
    // MARK: - Player Management
    
    func loadPlayers() async {
        isLoading = true
        await playerRepository.loadPlayers()
        players = playerRepository.sortedPlayers(by: selectedSortOption)
        isLoading = false
        error = playerRepository.error
    }
    
    // func deletePlayer(_ player: Player) {
    //     // TODO: Implement API endpoint for deleting players
    //     Task {
    //         await loadPlayers()
    //     }
        
    //     // If deleted player was selected, deselect them
    //     if gameSettings.player1?.id == player.id {
    //         gameSettings.player1 = nil
    //     }
    //     if gameSettings.player2?.id == player.id {
    //         gameSettings.player2 = nil
    //     }
    // }
    
    func selectPlayerImage(_ imageName: String) {
        selectedPlayerImage = imageName
    }
    
    func cancelAddPlayer() {
        newPlayerName = ""
        selectedPlayerImage = "person.fill"
    }
    
    // MARK: - Game Settings
    
    func selectPlayer1(_ player: Player?) {
        if let player = player {
            // TODO: Implement API endpoint for updating last used
            Task {
                await loadPlayers()
            }
        }
        gameSettings.player1 = player
        Task {
            await loadGamePreview()
        }
    }

    func selectPlayer2(_ player: Player?) {
        if let player = player {
            // TODO: Implement API endpoint for updating last used
            Task {
                await loadPlayers()
            }
        }
        gameSettings.player2 = player
        Task {
            await loadGamePreview()
        }
    }

    func loadGamePreview() async {
        guard let player1 = gameSettings.player1,
              let player2 = gameSettings.player2 else {
            gamePreview = nil
            return
        }

        isLoadingPreview = true
        do {
            gamePreview = try await apiClient.fetchGamePreview(
                playerAId: player1.id,
                playerBId: player2.id
            )
            print("✅ Game preview loaded successfully")
        } catch {
            print("❌ Failed to load game preview: \(error)")
            gamePreview = nil
        }
        isLoadingPreview = false
    }
    
    func setGameMode(_ mode: GameMode) {
        gameSettings.gameMode = mode
    }
    
    func setStartingPoints(_ points: StartingPoints) {
        gameSettings.startingPoints = points
    }
    
    func startGame() {
        guard gameSettings.canStartGame else { return }
        let settings = gameSettings // Create a copy of the current settings
        self.showIntroView = true
        navigationCoordinator.startGame(with: settings)
        gameSettings.player1?.updateLastUsed()
        gameSettings.player2?.updateLastUsed()
        // Reset settings only after navigation is complete

        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            self.showIntroView = false
            self.gameSettings = GameSettings()
        }
    }
} 
