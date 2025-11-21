import SwiftUI

struct DartNumberButton: View {
    let number: Int
    let action: () -> Void
    let multiplier: DartMultiplier
    var multiplidValue: Int {
        self.multiplier.multiplier * self.number
    }

    init(number: Int, action: @escaping () -> Void, multiplier: DartMultiplier = .single) {
        self.number = number
        self.action = action
        self.multiplier = multiplier
    }
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: DesignSystem.Spacing.xxs) {
                Text("\(multiplier.rawValue)\(number)")
                    .font(.title2)
                    .fontWeight(.semibold)
                if(multiplier != .single) {
                    Text("\(multiplidValue)")
                        .font(.callout)
                        .foregroundStyle(DesignSystem.Colors.secondary)
                }
            }
            .foregroundColor(DesignSystem.Colors.primary)
            .frame(maxHeight: .infinity)
            .frame(maxWidth: .infinity)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                    .fill(DesignSystem.Colors.systemGray6)
                    .overlay(
                        RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                            .stroke(DesignSystem.Colors.systemGray4, lineWidth: DesignSystem.BorderWidth.regular)
                    )
            )        }
    }
}

#Preview {
    HStack(spacing: DesignSystem.Spacing.xxxl) {
        DartNumberButton(number: 20, action: {return})
        DartNumberButton(number: 20, action: {return}, multiplier: .double)
        DartNumberButton(number: 20, action: {return}, multiplier: .triple)
    }
}
