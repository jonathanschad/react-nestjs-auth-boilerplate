//
//  GameSubmission.swift
//  DartScoringApp
//
//  DTOs for game submission to new backend API
//

import Foundation

struct CreateGameRequest: Encodable {
    let playerAId: String
    let playerBId: String
    let winnerId: String
    let gameStart: Date
    let gameEnd: Date
    let turns: [GameTurnRequest]
}

struct GameTurnRequest: Encodable {
    let playerId: String
    let turnNumber: Int
    let throw1: Int?
    let throw1Multiplier: Int?
    let throw2: Int?
    let throw2Multiplier: Int?
    let throw3: Int?
    let throw3Multiplier: Int?
}
