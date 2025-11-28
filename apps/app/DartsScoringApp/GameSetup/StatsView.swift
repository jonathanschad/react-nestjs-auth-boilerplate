//
//  StatsView.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 30.07.25.
//

import SwiftUI

struct StatsView: View {
    var body: some View {
        WebView()
            .ignoresSafeArea(.all)
            .background(DesignSystem.Colors.groupedBackground)
    }
}

#Preview {
    StatsView()
}
