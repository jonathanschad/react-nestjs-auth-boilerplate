import Foundation

struct DartRound: Identifiable, Hashable {
    let id = UUID()
    let dartThrows: [DartThrow]
    let timestamp: Date
    let totalScore: Int
    let isBust: Bool
    
    init(dartThrows: [DartThrow], isBust: Bool = false) {
        self.dartThrows = dartThrows
        self.timestamp = dartThrows.last?.timestamp ?? Date()
        self.isBust = isBust
        
        // If it's a bust, totalScore is 0 even though throws have values
        if isBust {
            self.totalScore = 0
        } else {
            self.totalScore = dartThrows.reduce(0) { sum, dartThrow in sum + dartThrow.score }
        }
    }
    
    var displayText: String {
        let isNoScore = dartThrows.filter { $0.number > 0 }.count == 0
        let throwTexts = dartThrows.map { $0.displayText }
        
        if isBust {
            return "BUST: " + throwTexts.joined(separator: ", ")
        } else if isNoScore {
            return "No Score"
        } else {
            return throwTexts.joined(separator: ", ")
        }
    }
    
    var isEmpty: Bool {
        return dartThrows.isEmpty
    }
} 