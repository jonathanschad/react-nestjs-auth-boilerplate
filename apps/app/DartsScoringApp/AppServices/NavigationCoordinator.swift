//
//  NavigationCoordinator.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import SwiftUI

// MARK: - Navigation Destinations
enum NavigationDestination: Hashable {
    case gameSetup
    case game(GameSettings)
}

// MARK: - Navigation Coordinator
class NavigationCoordinator: ObservableObject {
    @Published var path = NavigationPath()
    @Published var currentGameSettings: GameSettings?
    
    // MARK: - Navigation Actions

    func startGame(with settings: GameSettings) {
        currentGameSettings = settings
        path.append(NavigationDestination.game(settings))
    }
    
    func endGame() {
        currentGameSettings = nil
        path.removeLast()
    }
    
    func backToSetup() {
        currentGameSettings = nil
        path = NavigationPath()
    }
    
    func popToRoot() {
        currentGameSettings = nil
        path = NavigationPath()
    }
}

// MARK: - Navigation Environment Key
struct NavigationCoordinatorKey: EnvironmentKey {
    static let defaultValue = NavigationCoordinator()
}

extension EnvironmentValues {
    var navigationCoordinator: NavigationCoordinator {
        get { self[NavigationCoordinatorKey.self] }
        set { self[NavigationCoordinatorKey.self] = newValue }
    }
} 
