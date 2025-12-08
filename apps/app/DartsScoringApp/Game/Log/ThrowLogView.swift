//
//  ThrowLogView.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import SwiftUI

struct ThrowLogView: View {
    @ObservedObject var gamePlayer: GamePlayer
    let color: Color
    let title: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: DesignSystem.Spacing.sm) {
            HStack {
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.bold)
                    .foregroundColor(DesignSystem.Colors.primary)
                
                Spacer()
                
                Text("\(gamePlayer.dartThrows.count)")
                    .font(.caption2)
                    .foregroundColor(DesignSystem.Colors.secondary)
            }
            
            // Throws List
            ScrollView {
                LazyVStack(spacing: DesignSystem.Spacing.xxs) {
                    let recentThrows = Array(gamePlayer.dartThrows.suffix(15).reversed())
                    
                    if recentThrows.isEmpty {
                        // Empty State
                        VStack(spacing: DesignSystem.Spacing.sm) {
                            Image(systemName: "target")
                                .font(.title3)
                                .foregroundColor(DesignSystem.Colors.secondary)
                            
                            Text("Keine Würfe")
                                .font(.caption)
                                .foregroundColor(DesignSystem.Colors.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, DesignSystem.Spacing.xl)
                    } else {
                        ForEach(recentThrows) { dartThrow in
                            CompactThrowItemView(
                                dartThrow: dartThrow,
                                color: color
                            )
                        }
                    }
                }
                .padding(.vertical, DesignSystem.Spacing.xxs)
            }
            .frame(maxHeight: 180)
        }
        .padding(DesignSystem.Spacing.md)
        .background(
            RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                .fill(DesignSystem.Colors.systemBackground)
                .overlay(
                    RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                        .stroke(DesignSystem.Colors.systemGray4, lineWidth: DesignSystem.BorderWidth.thin)
                )
                .shadow(color: .black.opacity(0.04), radius: 4, x: 0, y: 1)
        )
    }
}

// MARK: - Compact Throw Item View

struct CompactThrowItemView: View {
    let dartThrow: DartThrow
    let color: Color
    
    private var scoreColor: Color {
        if dartThrow.number == 0 {
            return DesignSystem.Colors.error
        } else if dartThrow.score >= 50 {
            return DesignSystem.Colors.success
        } else if dartThrow.score >= 25 {
            return DesignSystem.Colors.warning
        } else {
            return DesignSystem.Colors.primary
        }
    }
    
    private var backgroundBolor: Color {
        if dartThrow.number == 0 {
            return DesignSystem.Colors.error.opacity(0.08)
        } else if dartThrow.score >= 50 {
            return DesignSystem.Colors.success.opacity(0.08)
        } else if dartThrow.multiplier != .single {
            return color.opacity(0.08)
        } else {
            return DesignSystem.Colors.systemGray6Light
        }
    }
    
    var body: some View {
        HStack(spacing: DesignSystem.Spacing.sm) {
            // Throw Display
            Text(dartThrow.displayText)
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(scoreColor)
                .frame(minWidth: 30, alignment: .leading)
            
            Spacer()
            
            // Score
            if dartThrow.number > 0 {
                Text("\(dartThrow.score)")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(scoreColor)
            } else {
                Text("0")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(DesignSystem.Colors.error)
            }
            
            // Time
            Text(formatTime(dartThrow.timestamp))
                .font(.caption2)
                .foregroundColor(DesignSystem.Colors.secondary)
                .frame(width: DesignSystem.Sizes.smallIcon, alignment: .trailing)
        }
        .padding(.horizontal, DesignSystem.Spacing.sm)
        .padding(.vertical, DesignSystem.Spacing.xs)
        .background(
            RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.small)
                .fill(backgroundBolor)
        )
    }
    
    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}

// MARK: - Dual Throw Log View (für beide Spieler)

struct DualThrowLogView: View {
    @ObservedObject var player1: GamePlayer
    @ObservedObject var player2: GamePlayer
    
    var body: some View {
        HStack(spacing: DesignSystem.Spacing.md) {
            // Player 1 Log
            ThrowLogView(
                gamePlayer: player1,
                color: DesignSystem.Colors.accent,
                title: player1.player.name
            )
            
            // Player 2 Log
            ThrowLogView(
                gamePlayer: player2,
                color: DesignSystem.Colors.error,
                title: player2.player.name
            )
        }
    }
}

// MARK: - Unified Throw Log View (beide Spieler zusammen)

struct UnifiedThrowLogView: View {
    @ObservedObject var player1: GamePlayer
    @ObservedObject var player2: GamePlayer
    let currentPlayerIndex: Int
    let compact: Bool
    
    init(player1: GamePlayer, player2: GamePlayer, currentPlayerIndex: Int, compact: Bool = false) {
        self.player1 = player1
        self.player2 = player2
        self.currentPlayerIndex = currentPlayerIndex
        self.compact = compact
    }
    
    private var allThrows: [(DartThrow, Int)] {
        let player1Throws = player1.dartThrows.map { ($0, 0) }
        let player2Throws = player2.dartThrows.map { ($0, 1) }
        let combined = player1Throws + player2Throws
        return combined.sorted { $0.0.timestamp > $1.0.timestamp }.prefix(compact ? 15 : 20).map { $0 }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: compact ? DesignSystem.Spacing.xs : DesignSystem.Spacing.sm) {
            // Header
            HStack {
                Text("Wurf-Historie")
                    .font(compact ? .subheadline : .headline)
                    .fontWeight(.bold)
                    .foregroundColor(DesignSystem.Colors.primary)
                
                Spacer()
                
                Text("\(player1.dartThrows.count + player2.dartThrows.count)")
                    .font(.caption)
                    .foregroundColor(DesignSystem.Colors.secondary)
            }
            
            // Throws List
            ScrollView {
                LazyVStack(spacing: compact ? DesignSystem.Spacing.xxs : DesignSystem.Spacing.xs) {
                    if allThrows.isEmpty {
                        // Empty State
                        VStack(spacing: compact ? DesignSystem.Spacing.sm : DesignSystem.Spacing.md) {
                            Image(systemName: "target")
                                .font(compact ? .title3 : .title2)
                                .foregroundColor(DesignSystem.Colors.secondary)
                            
                            Text("Noch keine Würfe")
                                .font(compact ? .caption : .subheadline)
                                .foregroundColor(DesignSystem.Colors.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, compact ? DesignSystem.Spacing.xl : DesignSystem.Spacing.xxl)
                    } else {
                        ForEach(Array(allThrows.enumerated()), id: \.offset) { index, throwData in
                            let (dartThrow, playerIndex) = throwData
                            UnifiedThrowItemView(
                                dartThrow: dartThrow,
                                playerName: playerIndex == 0 ? player1.player.name : player2.player.name,
                                color: playerIndex == 0 ? DesignSystem.Colors.accent : DesignSystem.Colors.error,
                                isCurrentPlayer: playerIndex == currentPlayerIndex,
                                compact: compact
                            )
                        }
                    }
                }
                .padding(.vertical, compact ? DesignSystem.Spacing.xxs : DesignSystem.Spacing.sm)
            }
            .frame(maxHeight: compact ? 150 : 250)
        }
        .padding(compact ? DesignSystem.Spacing.md : DesignSystem.Spacing.lg)
        .background(
            RoundedRectangle(cornerRadius: compact ? DesignSystem.CornerRadius.medium : DesignSystem.CornerRadius.large)
                .fill(DesignSystem.Colors.systemBackground)
                .overlay(
                    RoundedRectangle(cornerRadius: compact ? DesignSystem.CornerRadius.medium : DesignSystem.CornerRadius.large)
                        .stroke(DesignSystem.Colors.systemGray4, lineWidth: compact ? DesignSystem.BorderWidth.thin : DesignSystem.BorderWidth.regular)
                )
                .shadow(color: .black.opacity(0.06), radius: compact ? 4 : 8, x: 0, y: compact ? 1 : 2)
        )
    }
}

// MARK: - Unified Throw Item View

struct UnifiedThrowItemView: View {
    let dartThrow: DartThrow
    let playerName: String
    let color: Color
    let isCurrentPlayer: Bool
    let compact: Bool
    
    init(dartThrow: DartThrow, playerName: String, color: Color, isCurrentPlayer: Bool, compact: Bool = false) {
        self.dartThrow = dartThrow
        self.playerName = playerName
        self.color = color
        self.isCurrentPlayer = isCurrentPlayer
        self.compact = compact
    }
    
    private var scoreColor: Color {
        if dartThrow.number == 0 {
            return DesignSystem.Colors.error
        } else if dartThrow.score >= 50 {
            return DesignSystem.Colors.success
        } else if dartThrow.score >= 25 {
            return DesignSystem.Colors.warning
        } else {
            return DesignSystem.Colors.primary
        }
    }
    
    private var backgroundColor: Color {
        if isCurrentPlayer {
            return color.opacity(0.05)
        } else if dartThrow.number == 0 {
            return DesignSystem.Colors.error.opacity(0.05)
        } else if dartThrow.score >= 50 {
            return DesignSystem.Colors.success.opacity(0.05)
        } else {
            return DesignSystem.Colors.systemGray6Lighter
        }
    }
    
    var body: some View {
        HStack(spacing: compact ? DesignSystem.Spacing.sm : DesignSystem.Spacing.md) {
            // Player Indicator
            Circle()
                .fill(color)
                .frame(width: compact ? DesignSystem.Sizes.Compact.dotSize : DesignSystem.Sizes.Regular.dotSize,
                       height: compact ? DesignSystem.Sizes.Compact.dotSize : DesignSystem.Sizes.Regular.dotSize)
            
            // Player Name
            Text(playerName)
                .font(compact ? .caption2 : .caption)
                .fontWeight(.medium)
                .foregroundColor(color)
                .frame(width: compact ? DesignSystem.Sizes.Compact.throwWidth : DesignSystem.Sizes.Regular.throwWidth, alignment: .leading)
            
            // Throw Display
            Text(dartThrow.displayText)
                .font(compact ? .caption : .callout)
                .fontWeight(.medium)
                .foregroundColor(scoreColor)
                .frame(minWidth: compact ? 30 : 40, alignment: .leading)
            
            Spacer()
            
            // Score
            if dartThrow.number > 0 {
                Text("\(dartThrow.score)")
                    .font(compact ? .caption : .callout)
                    .fontWeight(.bold)
                    .foregroundColor(scoreColor)
            } else {
                Text("0")
                    .font(compact ? .caption : .callout)
                    .fontWeight(.bold)
                    .foregroundColor(DesignSystem.Colors.error)
            }
            
            // Time
            Text(formatTime(dartThrow.timestamp))
                .font(.caption2)
                .foregroundColor(DesignSystem.Colors.secondary)
                .frame(width: compact ? DesignSystem.Sizes.Compact.scoreWidth : DesignSystem.Sizes.Regular.scoreWidth, alignment: .trailing)
        }
        .padding(.horizontal, compact ? DesignSystem.Spacing.sm : DesignSystem.Spacing.md)
        .padding(.vertical, compact ? DesignSystem.Spacing.xs : DesignSystem.Spacing.sm)
        .background(
            RoundedRectangle(cornerRadius: compact ? DesignSystem.CornerRadius.small : DesignSystem.CornerRadius.medium)
                .fill(backgroundColor)
                .overlay(
                    RoundedRectangle(cornerRadius: compact ? DesignSystem.CornerRadius.small : DesignSystem.CornerRadius.medium)
                        .stroke(isCurrentPlayer ? color.opacity(0.3) : DesignSystem.Colors.clear, lineWidth: compact ? DesignSystem.BorderWidth.thin : DesignSystem.BorderWidth.regular)
                )
        )
    }
    
    private func formatTime(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
        return formatter.string(from: date)
    }
}

#Preview {
    let samplePlayer = GamePlayer(
        player: Player(name: "Max"),
        startingScore: 501
    )
    
    // Add some sample throws via the addThrow method
    samplePlayer.addThrow(DartThrow(number: 20, multiplier: .triple))
    samplePlayer.addThrow(DartThrow(number: 19, multiplier: .double))
    samplePlayer.addThrow(DartThrow(number: 15, multiplier: .single))
    samplePlayer.addThrow(DartThrow(number: 0, multiplier: .single)) // Miss
    samplePlayer.addThrow(DartThrow(number: 25, multiplier: .double)) // Bull
    
    return ThrowLogView(
        gamePlayer: samplePlayer,
        color: DesignSystem.Colors.accent,
        title: "Max"
    )
    .standardPadding()
    .standardBackground()
} 
