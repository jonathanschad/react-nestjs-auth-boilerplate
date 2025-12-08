import SwiftUI

enum DesignSystem {
    enum Colors {
        static let primary = Color.primary
        static let secondary = Color.secondary
        static let accent = Color.blue
        static let error = Color.red
        static let success = Color.green
        static let warning = Color.orange
        static let disabled = Color.gray
        
        static let systemBackground = Color(.systemBackground)
        static let groupedBackground = Color(.systemGroupedBackground)
        static let systemGray4 = Color(.systemGray4)
        static let systemGray5 = Color(.systemGray5)
        static let systemGray6 = Color(.systemGray6)
        static let clear = Color(.clear)

        // Opacity variants
        static let accentLight = accent.opacity(0.15)
        static let systemGray6Light = systemGray6.opacity(0.5)
        static let systemGray6Lighter = systemGray6.opacity(0.3)
    }
    
    enum Spacing {
        // Base spacing units
        static let xxs: CGFloat = 4
        static let xs: CGFloat = 6
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 20
        static let xxl: CGFloat = 24
        static let xxxl: CGFloat = 40
        
        // Special spacings
        static let keyboardPadding: CGFloat = 350
    }
    
    enum Sizes {
        // Icon sizes
        static let smallIcon: CGFloat = 40
        static let mediumIcon: CGFloat = 44
        static let largeIcon: CGFloat = 70
        static let extraLargeIcon: CGFloat = 80
        static let extraLargeIcon2: CGFloat = 110

        static let keyboardButtonMd: CGFloat = 85
        static let keyboardButtonLg: CGFloat = 95

        // Fixed heights
        static let multiplierHeight: CGFloat = 60
        static let playerInfoBoxHeight: CGFloat = 220
        
        // Fixed widths
        static let dividerWidth: CGFloat = 1
        static let buttonWidth: CGFloat = 250
        
        // Compact mode adjustments
        enum Compact {
            static let dotSize: CGFloat = 6
            static let scoreWidth: CGFloat = 35
            static let throwWidth: CGFloat = 40
        }
        
        enum Regular {
            static let dotSize: CGFloat = 8
            static let scoreWidth: CGFloat = 45
            static let throwWidth: CGFloat = 50
        }
    }
    
    enum BorderWidth {
        static let thin: CGFloat = 0.5
        static let regular: CGFloat = 1
        static let medium: CGFloat = 1.5
        static let thick: CGFloat = 3
    }
    
    enum CornerRadius {
        static let small: CGFloat = 8
        static let medium: CGFloat = 12
        static let large: CGFloat = 16
    }
}

// Extension to make usage more convenient
extension View {
    func standardPadding() -> some View {
        padding(DesignSystem.Spacing.md)
    }
    
    func standardBackground() -> some View {
        background(DesignSystem.Colors.groupedBackground)
    }
} 
