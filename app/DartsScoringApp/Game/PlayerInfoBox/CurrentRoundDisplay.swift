import SwiftUI

struct CurrentRoundDisplay: View {
    let dartThrows: [DartThrow]
    let color: Color

    enum BoxStyle {
        case empty
        case player1
        case player2
    }

    var body: some View {
        VStack(spacing: DesignSystem.Spacing.xxs) {
            HStack(spacing: DesignSystem.Spacing.sm) {
                ForEach(dartThrows, id: \.id) { dartThrow in
                    Text(dartThrow.displayText)
                        .font(.caption)
                        .fontWeight(.medium)
                        .padding(.horizontal, DesignSystem.Spacing.sm)
                        .padding(.vertical, DesignSystem.Spacing.xxs)
                        .background(
                            RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.small)
                                .fill(color.opacity(0.1))
                        )
                        .foregroundColor(color)
                }
                
                // Platzhalter für noch nicht geworfene Pfeile
                ForEach(0..<(3 - dartThrows.count), id: \.self) { _ in
                    Text("—")
                        .font(.caption)
                        .foregroundColor(DesignSystem.Colors.secondary)
                        .padding(.horizontal, DesignSystem.Spacing.sm)
                        .padding(.vertical, DesignSystem.Spacing.xxs)
                        .background(
                            RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.small)
                                .fill(DesignSystem.Colors.systemGray5)
                        )
                }
            }
        }
        .padding(.top, DesignSystem.Spacing.sm)
    }
}

#Preview {
    VStack {
        // Empty round
        CurrentRoundDisplay(
            dartThrows: [],
            color: DesignSystem.Colors.accent
        )
        
        // Partial round
        CurrentRoundDisplay(
            dartThrows: [
                DartThrow(number: 20, multiplier: .triple),
                DartThrow(number: 20, multiplier: .single)
            ],
            color: DesignSystem.Colors.error
        )
        
        // Complete round
        CurrentRoundDisplay(
            dartThrows: [
                DartThrow(number: 20, multiplier: .triple),
                DartThrow(number: 20, multiplier: .triple),
                DartThrow(number: 20, multiplier: .single)
            ],
            color: DesignSystem.Colors.accent
        )
    }
    .standardPadding()
    .standardBackground()
} 
