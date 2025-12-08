import SwiftUI

struct EmptyRoundState: View {
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "target")
                .font(.title2)
                .foregroundColor(.secondary)
            
            Text("Nothing to see...")
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 40)
    }
}

#Preview {
    EmptyRoundState()
        .padding()
        .background(Color(.systemBackground))
} 