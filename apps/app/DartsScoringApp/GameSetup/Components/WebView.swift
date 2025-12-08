//
//  StatsView.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 30.07.25.
//

import Foundation
import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {

    func makeUIView(context: Context) -> WKWebView {
        WKWebView(frame: .zero)
    }

    func updateUIView(_ view: WKWebView, context: UIViewRepresentableContext<WebView>) {

        let request = URLRequest(url: URL(string: "https://dart-bot-stats-40bf895a4f48.herokuapp.com/")!)

        view.load(request)
    }
}
