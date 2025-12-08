import SwiftUI

struct RoundHeader: View {
    let totalRounds: Int
    let canUndo: Bool
    var onUndo: () -> Void
    
    var body: some View {
        HStack {
            Text("Visits")
                .font(.headline)
                .fontWeight(.bold)
                .foregroundColor(.primary)
            
            Text("\(totalRounds) Visits")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Spacer()
            
            if canUndo {
                Button(action: onUndo) {
                    HStack(spacing: 4) {
                        Image(systemName: "arrow.uturn.backward")
                        Text("Letzten Wurf rückgängig")
                    }
                    .foregroundColor(.blue)
                }
            }
        }
    }
}

#Preview {
    VStack(spacing: 20) {
        // With both buttons
        RoundHeader(
            totalRounds: 5,
            canUndo: true,
            onUndo: {},
        )
        
        // With only undo
        RoundHeader(
            totalRounds: 5,
            canUndo: true,
            onUndo: {},
        )
        
        // With only switch
        RoundHeader(
            totalRounds: 0,
            canUndo: false,
            onUndo: {},
        )
        
        // Without buttons
        RoundHeader(
            totalRounds: 0,
            canUndo: false,
            onUndo: {},
        )
    }
    .padding()
    .background(Color(.systemBackground))
}
