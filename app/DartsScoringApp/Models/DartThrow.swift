import Foundation

enum DartMultiplier: String, CaseIterable {
    case single = ""
    case double = "D"
    case triple = "T"
    
    var multiplier: Int {
        switch self {
        case .single: return 1
        case .double: return 2
        case .triple: return 3
        }
    }
}

struct DartThrow: Identifiable, Hashable {
    let id: UUID = UUID()
    let number: Int // 1-20 oder 25 für Bull
    let multiplier: DartMultiplier
    let timestamp: Date
    
    var score: Int {
        return number * multiplier.multiplier
    }
    
    var displayText: String {
        if number == 0 {
            return "Miss"
        } else if number == 25 {
            return multiplier == .double ? "Bull" : "25"
        } else {
            return multiplier == .single ? "\(number)" : "\(multiplier.rawValue)\(number)"
        }
    }
    
    init(number: Int, multiplier: DartMultiplier = .single) {
        self.number = number
        self.multiplier = multiplier
        self.timestamp = Date()
    }
    
    // Special throws
    static let miss: DartThrow = DartThrow(number: 0, multiplier: .single)
    static let noScore: DartThrow = DartThrow(number: 0, multiplier: .single)
} 