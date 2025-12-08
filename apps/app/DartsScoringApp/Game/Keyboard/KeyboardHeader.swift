import SwiftUI

struct KeyboardHeader: View {
    let playerName: String
    let remainingThrows: Int
    
    var body: some View {
        VStack(spacing: 8) {
            Text("\(playerName) ist dran")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text("\(remainingThrows) Würfe übrig")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }
}

#Preview {
    KeyboardHeader(
        playerName: "Max",
        remainingThrows: 2
    )
    .padding()
    .background(Color(.systemBackground))
} 