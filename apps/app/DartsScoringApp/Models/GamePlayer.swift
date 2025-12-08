// MARK: - Game Player (erweitert Player für das Spiel)

import Foundation

class GamePlayer: ObservableObject, Identifiable, Equatable {
    static func == (lhs: GamePlayer, rhs: GamePlayer) -> Bool {
        lhs.id == rhs.id
    }

    let id = UUID()
    let player: Player
    @Published var currentScore: Int
    @Published var dartThrows: [DartThrow] = []
    @Published var rounds: [DartRound] = []
    @Published var currentRoundThrows: [DartThrow] = []

    private let startingScore: Int

    init(player: Player, startingScore: Int) {
        self.player = player
        self.startingScore = startingScore
        self.currentScore = startingScore
    }

    var average: Double {
        guard rounds.count > 0 else { return 0.0 }
        let totalScore = rounds.reduce(0) { $0 + $1.totalScore }
        return Double(totalScore) / Double(rounds.count)
    }

    var averageFormatted: String {
        return String(format: "%.1f", average)
    }

    var finishingWay: String? {
        return FinishingChart.getFinish(for: currentScore)
    }

    var canFinish: Bool {
        return FinishingChart.canFinish(currentScore)
    }

    var hasWon: Bool {
        return currentScore == 0
    }

    func addThrow(_ dartThrow: DartThrow) {
        dartThrows.append(dartThrow)
        currentRoundThrows.append(dartThrow)

        // Beim Double Out muss der letzte Wurf ein Double sein
        if currentScore - dartThrow.score == 0 {
            // Gewonnen nur wenn es ein Double war (außer bei Single Out)
            currentScore = 0
        } else if currentScore - dartThrow.score > 0 {
            currentScore -= dartThrow.score
        }
        // Bei negativem Score oder Überwerfen bleibt der Score unverändert
    }

    func finishRound(isBust: Bool = false) {
        if !currentRoundThrows.isEmpty {
            let round = DartRound(dartThrows: currentRoundThrows, isBust: isBust)
            rounds.append(round)
            currentRoundThrows = []
        }
    }

    func canMakeThrow(_ dartThrow: DartThrow, gameMode: GameMode) -> Bool {
        let newScore = currentScore - dartThrow.score

        if newScore < 0 {
            return false
        }

        if newScore == 1 && gameMode == .doubleOut {
            return false // Überworfen
        }

        if newScore == 0 {
            // Gewonnen - prüfe ob Double Out erforderlich
            if gameMode == .doubleOut && dartThrow.multiplier != .double {
                return false // Double Out erforderlich
            }
            return true
        }

        return true
    }
}
