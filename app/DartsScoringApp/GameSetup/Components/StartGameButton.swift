import SwiftUI

struct StartGameButton: View {
    let canStartGame: Bool
    let onStart: () -> Void
    
    var body: some View {
        VStack(spacing: DesignSystem.Spacing.md) {
            Button(action: onStart) {
                HStack {
                    Spacer()
                    Image(systemName: "play.fill")
                        .font(.title2)
                    Text("Spiel starten")
                        .font(.title2)
                        .fontWeight(.bold)
                    Spacer()
                }
                .foregroundColor(Color(.white))
                .padding(.vertical, DesignSystem.Spacing.xl)
                .background(
                    RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                        .fill(canStartGame ? 
                              LinearGradient(colors: [DesignSystem.Colors.success, DesignSystem.Colors.success.opacity(0.8)], startPoint: .top, endPoint: .bottom) :
                              LinearGradient(colors: [DesignSystem.Colors.success.opacity(0.6), DesignSystem.Colors.success.opacity(0.4)], startPoint: .top, endPoint: .bottom))
                        .shadow(color: DesignSystem.Colors.success.opacity(0.3), radius: 12, x: 0, y: 4)
                )
            }
            .disabled(!canStartGame)        }
    }
}

#Preview {
    VStack {
        StartGameButton(
            canStartGame: true,
            onStart: {}
        )
        
        StartGameButton(
            canStartGame: false,
            onStart: {}
        )
    }
    .padding()
    .background(DesignSystem.Colors.groupedBackground)
}
