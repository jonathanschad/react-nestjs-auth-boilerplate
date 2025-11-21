//
//  SoundManager.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import Foundation
import AVFoundation

class SoundManager: ObservableObject {
    static let shared = SoundManager()

    private var audioPlayer: AVAudioPlayer?
    @Published var isSoundEnabled: Bool = true

    private init() {
        configureAudioSession()
    }

    private func configureAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Failed to configure audio session: \(error)")
        }
    }

    func playGameOnSound() {
        guard isSoundEnabled else { return }
        playSound(filename: "gameon")
    }

    func playScoreSound(score: Int) {
        guard isSoundEnabled else { return }

        // Spiele nur Sounds für Scores die verfügbar sind (79-180)
        if score >= 0 && score <= 180 {
            playSound(filename: "\(score)")
        }
    }

    func playFinishSound() {
        guard isSoundEnabled else { return }
        playSound(filename: "anthem")

    }

    private func playSound(filename: String) {
        let url = Bundle.main.url(forResource: filename, withExtension: "wav")

        guard let finalUrl = url else {
            print("Sound file not found: \(filename).wav")
            return
        }
        
        do {
            // Stop current sound if playing
            audioPlayer?.stop()
            
            audioPlayer = try AVAudioPlayer(contentsOf: finalUrl)
            audioPlayer?.volume = 1.0
            audioPlayer?.play()
        } catch {
            print("Failed to play sound: \(error)")
        }
    }

    func stopSound() {
        audioPlayer?.stop()
    }

    func toggleSound() {
        isSoundEnabled.toggle()
    }
}
