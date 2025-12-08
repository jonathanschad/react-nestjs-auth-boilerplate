import SwiftUI

struct RoundItemView: View {
    let round: DartRound?
    let color: Color
    let roundNumber: Int
    
    var body: some View {
        VStack(spacing: 6) {
            if let round = round {
                // Round Content
                VStack(spacing: 4) {
                    Text("\(round.totalScore) Punkte")
                        .font(.callout)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                    
                    Text("\(round.displayText)")
                        .font(.caption)
                        .fontWeight(.bold)
                        .foregroundColor(scoreColor(for: round.totalScore))
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(color.opacity(0.08))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(color.opacity(0.3), lineWidth: 1)
                        )
                )
            } else {
                // Empty Round
                VStack(spacing: 4) {
                    Text("—")
                        .font(.callout)
                        .foregroundColor(.secondary)
                    
                    Text("0 Punkte")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color(.systemGray6).opacity(0.5))
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color(.systemGray4), lineWidth: 1)
                        )
                )
            }
            
            // Round Number
            Text("V\(roundNumber)")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
    }
    
    private func scoreColor(for score: Int) -> Color {
        if score >= 100 {
            return .green
        } else if score >= 60 {
            return .orange
        } else {
            return .secondary
        }
    }
}

#Preview {
    HStack {
        // Empty round
        RoundItemView(
            round: nil,
            color: .blue,
            roundNumber: 1
        )
        
        // Round with score
        RoundItemView(
            round: DartRound(dartThrows: [
                DartThrow(number: 20, multiplier: .triple),
                DartThrow(number: 20, multiplier: .triple),
                DartThrow(number: 20, multiplier: .single)
            ]),
            color: .red,
            roundNumber: 2
        )
    }
    .padding()
    .background(Color(.systemBackground))
} 
