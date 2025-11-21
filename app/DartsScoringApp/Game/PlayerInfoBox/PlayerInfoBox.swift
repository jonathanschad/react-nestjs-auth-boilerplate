//
//  PlayerInfoBox.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import SwiftUI

struct PlayerInfoBox: View {
    @ObservedObject var gamePlayer: GamePlayer
    @ObservedObject var gameViewModel: GameViewModel
    let color: Color
    let isActive: Bool
    var finishingWay: String {
        if let finishingWay = gamePlayer.finishingWay, gamePlayer.currentScore <= 170 {
            return finishingWay
        } else {
            return "Kein Finish"
        }
    }

    var formattedPlayerName: String {
        gamePlayer.player.name.components(separatedBy: " ").first ?? ""
    }

    var body: some View {
        VStack(spacing: DesignSystem.Spacing.lg) {
            // Header mit Avatar und Name
            HStack(spacing: DesignSystem.Spacing.md) {
                Image(systemName: "person.fill")
                    .font(.title2)
                    .foregroundColor(color)
                    .frame(width: DesignSystem.Sizes.smallIcon, height: DesignSystem.Sizes.smallIcon)
                    .background(
                        Circle()
                            .fill(color.opacity(0.1))
                    )
                
                VStack(alignment: .leading, spacing: DesignSystem.Spacing.xxs) {
                    Text(formattedPlayerName)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(DesignSystem.Colors.primary)
                    
                    // Average - größer und prominenter
                    Text("⌀ \(gamePlayer.averageFormatted)")
                        .font(.title3)
                        .fontWeight(.semibold)
                        .foregroundColor(color)
                }
                
                Spacer()
            }
            
            // Score - großer und zentral
            VStack(spacing: DesignSystem.Spacing.sm) {
                Text("\(gamePlayer.currentScore)")
                    .font(.system(size: 56, weight: .bold, design: .rounded))
                    .foregroundColor(color)
                    .monospacedDigit()
                
                // Finishing Info
                    Text(self.finishingWay)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(DesignSystem.Colors.secondary)
                        .padding(.horizontal, DesignSystem.Spacing.md)
                        .padding(.vertical, DesignSystem.Spacing.xs)
                        .background(
                            RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.small)
                                .fill(DesignSystem.Colors.systemGray6)
                        )
                
                // Current Round Throws - nur für aktiven Spieler
                    CurrentRoundDisplay(
                        dartThrows: gamePlayer.currentRoundThrows,
                        color: color
                    )
            }
            
            Spacer()
        }
        .frame(maxWidth: .infinity)
        .frame(height: DesignSystem.Sizes.playerInfoBoxHeight)
        .padding(DesignSystem.Spacing.xl)
        .background(
            RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                .fill(DesignSystem.Colors.systemBackground)
                .overlay(
                    RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                        .stroke(isActive ? color : DesignSystem.Colors.systemGray4, 
                               lineWidth: isActive ? DesignSystem.BorderWidth.thick : DesignSystem.BorderWidth.regular)
                )
                .shadow(
                    color: isActive ? color.opacity(0.3) : .black.opacity(0.06),
                    radius: isActive ? 12 : 8,
                    x: 0,
                    y: isActive ? 6 : 2
                )
        )
    }
}

#Preview {
    var gameSettings = GameSettings()
    gameSettings.player1 = Player(name: "ASASAS")
    gameSettings.player2 = Player(name: "SDSDSD")
    let sampleViewModel = GameViewModel(gameSettings: gameSettings)
    
    return HStack(spacing: DesignSystem.Spacing.lg) {
        PlayerInfoBox(
            gamePlayer: sampleViewModel.player1,
            gameViewModel: sampleViewModel,
            color: DesignSystem.Colors.accent,
            isActive: true
        )
        
        PlayerInfoBox(
            gamePlayer: sampleViewModel.player2,
            gameViewModel: sampleViewModel,
            color: DesignSystem.Colors.error,
            isActive: false
        )
    }
    .standardPadding()
    .standardBackground()
} 
