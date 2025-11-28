import SwiftUI

struct MultiplierButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(DesignSystem.Colors.primary)
                .frame(maxWidth: .infinity)
                .frame(height: DesignSystem.Sizes.multiplierHeight)
                .background(
                    RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                        .fill(isSelected ? DesignSystem.Colors.systemGray4 : DesignSystem.Colors.systemGray6)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                        .stroke(DesignSystem.Colors.systemGray4, lineWidth: DesignSystem.BorderWidth.regular)
                )
        }
    }
}

#Preview {
    HStack(spacing: DesignSystem.Spacing.lg) {
        MultiplierButton(
            title: "Double",
            isSelected: true,
            action: {}
        )
        
        MultiplierButton(
            title: "Triple",
            isSelected: false,
            action: {}
        )
    }
    .standardPadding()
    .background(DesignSystem.Colors.systemBackground)
} 