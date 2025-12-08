//
//  DartSpecialButton.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 28.07.25.
//

import SwiftUI

struct DartSpecialButton: View {
    let action: () -> Void
    let title: String
    let subtitle: String?
    let systemImage: String?
    let backgroundColor: Color
    let textColor: Color
    let strokeColor: Color
    let disabled: Bool

    var body: some View {
        Button(action: action) {
            VStack(spacing: DesignSystem.Spacing.xxs) {
                if let systemImage = systemImage {
                    Image(systemName: systemImage)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(textColor)
                } else {
                    Text(title)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(textColor)
                }
                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(.callout)
                        .foregroundColor(textColor.opacity(0.8))
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: DesignSystem.Sizes.extraLargeIcon)
            .background(
                RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                    .fill(backgroundColor)
                    .overlay(
                        RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.medium)
                            .stroke(strokeColor, lineWidth: DesignSystem.BorderWidth.medium)
                    )
            )
            .opacity(disabled ? 0.5 : 1.0)
        }
        .disabled(disabled)
    }
}
