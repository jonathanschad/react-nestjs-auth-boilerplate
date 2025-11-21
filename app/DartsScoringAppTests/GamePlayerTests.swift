import Testing
@testable import DartsScoringApp

@Suite("Game Player Tests")
final class GamePlayerTests {
    var player: Player!
    var gamePlayer: GamePlayer!
    
    func setUp() {
        player = Player(id: "1", name: "Test Player", eloRating: 1000)
        gamePlayer = GamePlayer(player: player, startingScore: 301)
    }
    
    func tearDown() {
        player = nil
        gamePlayer = nil
    }
    
    @Test("Initial state should be correct")
    func testInitialState() throws {
        setUp()
        defer { tearDown() }
        
        #expect(gamePlayer.currentScore == 301)
        #expect(gamePlayer.dartThrows.isEmpty)
        #expect(gamePlayer.rounds.isEmpty)
        #expect(gamePlayer.currentRoundThrows.isEmpty)
        #expect(gamePlayer.average == 0.0)
        #expect(!gamePlayer.hasWon)
    }
    
    @Test("Adding throws should update score correctly")
    func testAddingThrows() throws {
        setUp()
        defer { tearDown() }
        
        let throw1 = DartThrow(number: 20, multiplier: .single) // 20
        gamePlayer.addThrow(throw1)
        #expect(gamePlayer.currentScore == 281)
        #expect(gamePlayer.dartThrows.count == 1)
        #expect(gamePlayer.currentRoundThrows.count == 1)
        
        let throw2 = DartThrow(number: 20, multiplier: .double) // 40
        gamePlayer.addThrow(throw2)
        #expect(gamePlayer.currentScore == 241)
        #expect(gamePlayer.dartThrows.count == 2)
        #expect(gamePlayer.currentRoundThrows.count == 2)
    }
    
    @Test("Finishing round should clear current throws")
    func testFinishingRound() throws {
        setUp()
        defer { tearDown() }
        
        // Add three throws
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single)) // 20
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single)) // 20
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single)) // 20
        
        // Finish round
        gamePlayer.finishRound()
        
        #expect(gamePlayer.rounds.count == 1)
        #expect(gamePlayer.currentRoundThrows.isEmpty)
        #expect(gamePlayer.dartThrows.count == 3)
        #expect(gamePlayer.currentScore == 241)
        #expect(gamePlayer.rounds.last?.totalScore == 60)
    }
    
    @Test("Average calculation should be correct")
    func testAverageCalculation() throws {
        setUp()
        defer { tearDown() }
        
        // Add a round of 60 points (3 x 20)
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single))
        gamePlayer.finishRound()
        
        // Add a round of 30 points (3 x 10)
        gamePlayer.addThrow(DartThrow(number: 10, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 10, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 10, multiplier: .single))
        gamePlayer.finishRound()
        
        // Total points = 90, rounds = 2, average should be 45
        #expect(gamePlayer.average == 45.0)
    }
    
    @Test("Average should only update after completing rounds, not during throws")
    func testAverageOnlyUpdatesAfterCompletingRound() throws {
        setUp()
        defer { tearDown() }
        
        // Initially, average should be 0
        #expect(gamePlayer.average == 0.0)
        
        // Complete first round: 60 points (3 x 20)
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .single))
        gamePlayer.finishRound()
        
        // Average should now be 60
        #expect(gamePlayer.average == 60.0)
        #expect(gamePlayer.currentScore == 241) // 301 - 60 = 241
        
        // Start second round but don't finish it
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .triple)) // 60 points
        
        // Average should STILL be 60, not affected by incomplete round
        #expect(gamePlayer.average == 60.0)
        #expect(gamePlayer.currentScore == 181) // Score is updated but average is not
        
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .triple)) // Another 60 points
        
        // Average should STILL be 60, not affected by incomplete round
        #expect(gamePlayer.average == 60.0)
        #expect(gamePlayer.currentScore == 121) // Score is updated but average is not
        
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .triple)) // Another 60 points
        
        // Average should STILL be 60 before finishing the round
        #expect(gamePlayer.average == 60.0)
        #expect(gamePlayer.currentScore == 61) // Score is updated but average is not
        
        // Now finish the round
        gamePlayer.finishRound()
        
        // Now average should be updated: (60 + 180) / 2 = 120
        #expect(gamePlayer.average == 120.0)
        #expect(gamePlayer.rounds.count == 2)
    }
    
    @Test("Average calculation with mixed scores")
    func testAverageWithMixedScores() throws {
        setUp()
        defer { tearDown() }
        
        // Round 1: 100 points
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .triple)) // 60
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .double)) // 40
        gamePlayer.addThrow(DartThrow(number: 0, multiplier: .single))   // 0 (miss)
        gamePlayer.finishRound()
        #expect(gamePlayer.average == 100.0)
        
        // Round 2: 45 points
        gamePlayer.addThrow(DartThrow(number: 15, multiplier: .single)) // 15
        gamePlayer.addThrow(DartThrow(number: 15, multiplier: .single)) // 15
        gamePlayer.addThrow(DartThrow(number: 15, multiplier: .single)) // 15
        gamePlayer.finishRound()
        #expect(gamePlayer.average == 72.5) // (100 + 45) / 2
        
        // Round 3: 180 points (maximum)
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .triple)) // 60
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .triple)) // 60
        gamePlayer.addThrow(DartThrow(number: 20, multiplier: .triple)) // 60
        gamePlayer.finishRound()
        #expect(gamePlayer.average == 108.33333333333333) // (100 + 45 + 180) / 3
        
        // Round 4: 0 points (all misses)
        gamePlayer.addThrow(DartThrow(number: 0, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 0, multiplier: .single))
        gamePlayer.addThrow(DartThrow(number: 0, multiplier: .single))
        gamePlayer.finishRound()
        #expect(gamePlayer.average == 81.25) // (100 + 45 + 180 + 0) / 4
    }
    
    @Test("Can finish check should work correctly")
    func testCanFinishCheck() throws {
        setUp()
        defer { tearDown() }
        
        // Set score to a finishable number
        gamePlayer.currentScore = 40
        #expect(gamePlayer.canFinish)
        
        // Set score to an unfinishable number
        gamePlayer.currentScore = 159
        #expect(!gamePlayer.canFinish)
    }
    
    @Test("Can make throw validation should work correctly")
    func testCanMakeThrowValidation() throws {
        setUp()
        defer { tearDown() }
        
        // Valid throw
        let validThrow = DartThrow(number: 20, multiplier: .single)
        #expect(gamePlayer.canMakeThrow(validThrow, gameMode: .doubleOut))
        
        // Set score to 50
        gamePlayer.currentScore = 50
        
        // Invalid throw (would go below 0)
        let invalidThrow = DartThrow(number: 20, multiplier: .triple)
        #expect(!gamePlayer.canMakeThrow(invalidThrow, gameMode: .doubleOut))
        
        // Set score to 2
        gamePlayer.currentScore = 2
        
        // Invalid throw (would leave 1 in double-out mode)
        let throwLeavingOne = DartThrow(number: 1, multiplier: .single)
        #expect(!gamePlayer.canMakeThrow(throwLeavingOne, gameMode: .doubleOut))
    }
    
    @Test("Has won should be true when score is 0")
    func testHasWon() throws {
        setUp()
        defer { tearDown() }
        
        #expect(!gamePlayer.hasWon)
        
        gamePlayer.currentScore = 0
        #expect(gamePlayer.hasWon)
    }
    
    @Test("Finishing way should be correct")
    func testFinishingWay() throws {
        setUp()
        defer { tearDown() }
        
        // Set score to a common finish
        gamePlayer.currentScore = 40
        #expect(gamePlayer.finishingWay != nil)

        // Set score to an impossible finish with a setup throw
        gamePlayer.currentScore = 159
        #expect(gamePlayer.finishingWay == nil)
    }
}
