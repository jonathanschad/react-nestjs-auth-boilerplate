//
//  ContentView.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import SwiftUI

struct ContentView: View {
    @StateObject private var navigationCoordinator = NavigationCoordinator()
    
    var body: some View {
        NavigationStack(path: $navigationCoordinator.path) {
            GameSetupView(navigationCoordinator: navigationCoordinator)
                .navigationDestination(for: NavigationDestination.self) { destination in
                    switch destination {
                    case .gameSetup:
                        GameSetupView(navigationCoordinator: navigationCoordinator)
                    case .game(let gameSettings):
                        GameView(gameSettings: gameSettings)
                    }
                }
        }
        .environment(\.navigationCoordinator, navigationCoordinator)
        .preferredColorScheme(.light)
    }
}

#Preview {
    ContentView()
}
