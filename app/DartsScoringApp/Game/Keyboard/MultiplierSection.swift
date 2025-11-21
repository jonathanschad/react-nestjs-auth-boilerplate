import SwiftUI

struct MultiplierSection: View {
    @ObservedObject var viewModel: GameViewModel
    
    var body: some View {
        HStack(spacing: DesignSystem.Spacing.lg) {
            MultiplierButton(
                title: "Double",
                isSelected: viewModel.selectedMultiplier == .double,
                action: {
                    if viewModel.selectedMultiplier == .double {
                        viewModel.setMultiplier(.single)
                    } else {
                        viewModel.setMultiplier(.double)
                    }
                }
            )
            
            MultiplierButton(
                title: "Triple",
                isSelected: viewModel.selectedMultiplier == .triple,
                action: {
                    if viewModel.selectedMultiplier == .triple {
                        viewModel.setMultiplier(.single)
                    } else {
                        viewModel.setMultiplier(.triple)
                    }
                }
            )
        }
    }
}

#Preview {
    let gameSettings = GameSettings()
    let viewModel = GameViewModel(gameSettings: gameSettings)
    
    return MultiplierSection(viewModel: viewModel)
        .standardPadding()
        .background(DesignSystem.Colors.systemBackground)
} 
