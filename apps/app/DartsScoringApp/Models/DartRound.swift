import Foundation

struct DartRound: Identifiable, Hashable {
    let id = UUID()
    let dartThrows: [DartThrow]
    let timestamp: Date
    let totalScore: Int
    
    init(dartThrows: [DartThrow]) {
        self.dartThrows = dartThrows
        self.timestamp = dartThrows.last?.timestamp ?? Date()
        self.totalScore = dartThrows.reduce(0) { sum, dartThrow in sum + dartThrow.score }
    }
    
    var displayText: String {
        let isNoScore = dartThrows.filter { $0.number > 0 }.count == 0
        let throwTexts = dartThrows.map { $0.displayText }
        return isNoScore ? "No Score" : throwTexts.joined(separator: ", ")
    }
    
    var isEmpty: Bool {
        return dartThrows.isEmpty
    }
} 