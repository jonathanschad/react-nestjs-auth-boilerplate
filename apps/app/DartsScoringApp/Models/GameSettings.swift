//
//  GameSettings.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import Foundation

enum GameMode: String, CaseIterable, Hashable {
    case doubleOut = "Double Out"
    case singleOut = "Single Out"
}

enum StartingPoints: Int, CaseIterable, Hashable {
    case _301 = 301
    case _501 = 501
    
    var displayName: String {
        return "\(self.rawValue)"
    }
    
    // Keep backwards compatibility
    static let points301 = StartingPoints._301
    static let points501 = StartingPoints._501
}

struct GameSettings: Hashable, Equatable {
    var player1: Player?
    var player2: Player?
    var gameMode: GameMode
    var startingPoints: StartingPoints
    
    init() {
        self.player1 = nil
        self.player2 = nil
        self.gameMode = .doubleOut
        self.startingPoints = ._301
    }

    var canStartGame: Bool {
        return player1 != nil && player2 != nil && player1 != player2
    }
}
