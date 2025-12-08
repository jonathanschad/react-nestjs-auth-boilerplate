//
//  Player.swift
//  DartScoringApp
//
//  Created by Philipp Seemann on 25.07.25.
//

import Foundation

struct Player: Identifiable, Codable, Equatable, Hashable {
    let id: String // UUID from new backend
    let name: String
    let currentElo: Double? // Can be null in backend
    let lastGamePlayedAt: Date?

    // Computed property for backward compatibility with existing UI
    var eloRating: Double {
        return Double(currentElo ?? 1000)
    }
    
    // MARK: - UserDefaults Keys
    private static let lastUsedDatesKey = "player_last_used_dates"
    
    var lastUsed: Date {
        get {
            let defaults = UserDefaults.standard
            guard let dates = defaults.dictionary(forKey: Self.lastUsedDatesKey) as? [String: TimeInterval] else {
                return Date.distantPast
            }
            guard let timestamp = dates[id] else {
                return Date.distantPast
            }
            return Date(timeIntervalSince1970: timestamp)
        }
    }
    
    func updateLastUsed() {
        let defaults = UserDefaults.standard
        let now = Date()
        var dates = defaults.dictionary(forKey: Player.lastUsedDatesKey) as? [String: TimeInterval] ?? [:]
        dates[self.id] = now.timeIntervalSince1970
        defaults.set(dates, forKey: Player.lastUsedDatesKey)
    }

    private enum CodingKeys: String, CodingKey {
        case id
        case name
        case currentElo
        case lastGamePlayedAt
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        name = try container.decode(String.self, forKey: .name)
        currentElo = try container.decodeIfPresent(Double.self, forKey: .currentElo)
        lastGamePlayedAt = try container.decodeIfPresent(Date.self, forKey: .lastGamePlayedAt)
    }

    init(id: String = UUID().uuidString,
         name: String,
         currentElo: Double? = 1000,
         lastGamePlayedAt: Date? = nil
         ) {
        self.id = id
        self.name = name
        self.currentElo = currentElo
        self.lastGamePlayedAt = lastGamePlayedAt
    }
    
    static func == (lhs: Player, rhs: Player) -> Bool {
        return lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    internal var firstName: String {
        return name.components(separatedBy: " ").first ?? ""
    }
}

// MARK: - Sorting Options
extension Player {
    enum SortOption: String, CaseIterable {
        case name = "Name"
        case lastUsed = "Zuletzt verwendet"
        case elo = "ELO Rating"
        
        var comparator: (Player, Player) -> Bool {
            switch self {
            case .name:
                return { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
            case .lastUsed:
                return { $0.lastUsed > $1.lastUsed }
            case .elo:
                return { $0.eloRating > $1.eloRating }
            }
        }
    }
}
