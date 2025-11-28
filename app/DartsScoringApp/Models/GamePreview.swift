//
//  GamePreview.swift
//  DartScoringApp
//
//  DTO for game preview response from backend
//

import Foundation

struct GamePreviewResponse: Codable {
    let playerA: PlayerPreview
    let playerB: PlayerPreview
}

struct PlayerPreview: Codable {
    let id: String
    let name: String
    let elo: EloPreview
}

struct EloPreview: Codable {
    let onWin: Int
    let onLoss: Int
    let current: Int
}
