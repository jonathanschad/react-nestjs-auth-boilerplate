import Testing
@testable import DartsScoringApp

@Suite("Game View Model Tests")
final class GameViewModelTests {
    var viewModel: GameViewModel!
    var player1: Player!
    var player2: Player!
    var settings: GameSettings!
    
    func setUp() {
        player1 = Player(id: "1", name: "Player 1")
        player2 = Player(id: "2", name: "Player 2")
        settings = GameSettings()
        settings.player1 = player1
        settings.player2 = player2
        settings.gameMode = .doubleOut
        settings.startingPoints = .points301
        viewModel = GameViewModel(gameSettings: settings)
    }
    
    func tearDown() {
        viewModel = nil
        player1 = nil
        player2 = nil
        settings = nil
    }
    
    @Test("Three throws should complete a round")
    func testThreeThrowsCompleteRound() throws {
        setUp()
        defer { tearDown() }
        
        // When
        viewModel.makeThrow(20) // 20
        #expect(viewModel.currentThrowInTurn == 1)
        
        viewModel.makeThrow(20) // 20
        #expect(viewModel.currentThrowInTurn == 2)
        
        viewModel.makeThrow(20) // 20
        
        // Then
        #expect(viewModel.player1.rounds.count == 1, "Should have completed one round")
        #expect(viewModel.player1.currentScore == 241, "Score should be 301 - 60")
        #expect(viewModel.currentPlayerIndex == 1, "Should have switched to player 2")
        #expect(viewModel.currentThrowInTurn == 0, "Should have reset throw counter")
    }

    @Test("Overthrowing with the third dart should result in no score")
    func testOverthrowingWithFirstDartResultsInNoScore() throws {
        setUp()
        defer { tearDown() }

        // Set initial score to test overthrowing
        viewModel.player1.currentScore = 10

        // When - Try to throw more than remaining points
        viewModel.makeThrow(20) // 20 - This would put us at -10 points, which is invalid

        // Then
        #expect(viewModel.player1.currentScore == 10, "Score should remain unchanged after overthrowing")
        #expect(viewModel.currentPlayerIndex == 1, "Should have switched to player 2")
    }

    @Test("Overthrowing with the second dart should result in no score")
    func testOverthrowingWithSecondDartResultsInNoScore() throws {
        setUp()
        defer { tearDown() }

        // Set initial score to test overthrowing
        viewModel.player1.currentScore = 30

        // When - Try to throw more than remaining points
        viewModel.makeThrow(20) // 20 - This would put us at 10 points
        viewModel.makeThrow(20) // 20 - This would put us at -10 points, which is invalid

        // Then
        #expect(viewModel.player1.currentScore == 30, "Score should remain unchanged after overthrowing")
        #expect(viewModel.currentPlayerIndex == 1, "Should have switched to player 2")
    }

    @Test("Overthrowing with the third dart should result in no score")
    func testOverthrowingWithThirdDartResultsInNoScore() throws {
        setUp()
        defer { tearDown() }
        
        // Set initial score to test overthrowing
        viewModel.player1.currentScore = 50

        // When - Try to throw more than remaining points
        viewModel.makeThrow(20) // 20
        viewModel.makeThrow(20) // 20 - This would put us at 10 points
        viewModel.makeThrow(20) // 20 - This would put us at -10 points, which is invalid
        
        // Then
        #expect(viewModel.player1.currentScore == 50, "Score should remain unchanged after overthrowing")
        #expect(viewModel.currentPlayerIndex == 1, "Should have switched to player 2")
    }
    
    @Test("Three misses should result in no score")
    func testThreeMissesResultInNoScore() throws {
        setUp()
        defer { tearDown() }
        
        let initialScore = viewModel.player1.currentScore
        
        // When
        viewModel.makeMiss()
        viewModel.makeMiss()
        viewModel.makeMiss()
        
        // Then
        #expect(viewModel.player1.currentScore == initialScore, "Score should remain unchanged after three misses")
        #expect(viewModel.currentPlayerIndex == 1, "Should have switched to player 2")
        #expect(viewModel.player1.rounds.last?.totalScore == 0, "Round score should be 0")
    }

    @Test("Game should be won with a double in double-out mode")
    func testWinningWithDouble() throws {
        setUp()
        defer { tearDown() }
        
        // Set score to 20 (can be won with double 10)
        viewModel.player1.currentScore = 20

        // Try to win with a non-double (should fail)
        viewModel.makeThrow(20)
        #expect(viewModel.gameState == .playing, "Game should not be won with a non-double")
        #expect(viewModel.player1.currentScore == 20, "Score should reset")
        #expect(viewModel.currentPlayer == viewModel.player2, "Player should switch")
        #expect(viewModel.currentThrowInTurn == 0, "Throws should be resetted")

        viewModel.currentPlayerIndex = 0
        // Win with a double
        viewModel.setMultiplier(.double)
        viewModel.makeThrow(10)

        #expect(viewModel.gameState == .finished(winner: player1))
    }

    @Test("Scores above 20 should be invalid")
    func testScoreAbove20IsInvalid() throws {
        setUp()
        defer { tearDown() }

        viewModel.player1.currentScore = 21
        viewModel.makeThrow(21)
        #expect(viewModel.player1.currentScore == 21, "Score should not change for invalid number")
    }

    @Test("Single Bull (25) should be valid")
    func testSingleBullIsValid() throws {
        setUp()
        defer { tearDown() }
        
        viewModel.player1.currentScore = 30
        viewModel.setMultiplier(.single)
        viewModel.makeThrow(25)
        #expect(viewModel.player1.currentScore == 5, "Score should be 5 after single bull")
    }

    @Test("Double Bull (50) should be valid")
    func testDoubleBullIsValid() throws {
        setUp()
        defer { tearDown() }
        
        viewModel.player1.currentScore = 60
        viewModel.setMultiplier(.double)
        viewModel.makeThrow(25)
        #expect(viewModel.player1.currentScore == 10, "Score should be 10 after double bull")
    }

    @Test("Triple Bull should be invalid")
    func testTripleBullIsValid() throws {
        setUp()
        defer { tearDown() }
        
        viewModel.player1.currentScore = 90
        viewModel.setMultiplier(.triple)
        viewModel.makeThrow(25)
        #expect(viewModel.player1.currentScore == 90, "Score should remain 90 after triple bull")
    }

    @Test("Score of 1 should be invalid in double-out mode")
    func testScoreOfOneInDoubleOut() throws {
        setUp()
        defer { tearDown() }
        
        // Set score to 3
        viewModel.player1.currentScore = 3
        
        // Try to throw 2 (would leave 1)
        viewModel.makeThrow(2)
        
        // Score should remain at 3 as we can't leave 1 in double-out
        #expect(viewModel.player1.currentScore == 3, "Score should remain at 3 as we can't leave 1 in double-out")
        #expect(viewModel.currentPlayerIndex == 1, "Should switch players after invalid throw")
    }

    @Test("Player switching should work correctly")
    func testPlayerSwitching() throws {
        setUp()
        defer { tearDown() }

        // First player makes three throws
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        
        #expect(viewModel.currentPlayerIndex == 1, "Should switch to player 2")
        
        // Second player makes three throws
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        
        #expect(viewModel.currentPlayerIndex == 0, "Should switch back to player 1")
    }

    @Test("Player making no score should switch to the other player")
    func testPlayerMakingNoScoreSwitchesToOtherPlayer() throws {
        setUp()
        defer { tearDown() }
        
        // First player makes no score
        viewModel.makeNoScore()
        #expect(viewModel.player1.currentScore == 301, "Score should be 301")
        #expect(viewModel.currentPlayerIndex == 1, "Should switch back to player 2")

        // Second player makes no score
        viewModel.makeNoScore()
        #expect(viewModel.player2.currentScore == 301, "Score should be 301")
        #expect(viewModel.currentPlayerIndex == 0, "Should switch back to player 1")
    }

    @Test("Score calculations should be correct")
    func testScoreCalculations() throws {
        setUp()
        defer { tearDown() }


        // Test single
        viewModel.setMultiplier(.single)
        viewModel.makeThrow(20)
        #expect(viewModel.player1.currentScore == 281, "Single 20 should subtract 20")

        // Test double
        viewModel.setMultiplier(.double)
        viewModel.makeThrow(20)
        #expect(viewModel.player1.currentScore == 241, "Double 20 should subtract 40")

        // Test triple
        viewModel.setMultiplier(.triple)
        viewModel.makeThrow(20)
        #expect(viewModel.player1.currentScore == 181, "Triple 20 should subtract 60")
    }

    @Test("Round management should work correctly")
    func testRoundManagement() throws {
        setUp()
        defer { tearDown() }
        
        // Make three throws
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        
        #expect(viewModel.player1.rounds.count == 1, "Should have one completed round")
        #expect(viewModel.player1.rounds.last?.totalScore == 60, "Round score should be 60")
        
        // Clear current round before completion
        viewModel.makeThrow(20)
        viewModel.clearCurrentRound()
        #expect(viewModel.currentThrowInTurn == 0, "Should reset throw counter after clearing")
        #expect(viewModel.player1.dartThrows.count == 3)
    }

    @Test("Undoing a round should reset the score")
    func testUndoingARoundResetsScore() throws {
        setUp()
        defer { tearDown() }
        
        // Make three throws
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        #expect(viewModel.player1.currentScore == 241, "Score should be 241")
        #expect(viewModel.currentPlayerIndex == 1, "Should switch to player 2")

        // Undo the round
        viewModel.undoLastRound()
        #expect(viewModel.player1.currentScore == 301, "Score should be 301")
        #expect(viewModel.currentPlayerIndex == 0, "Should switch back to player 1")
    }

    @Test("Double out mode should work correctly")
    func testDoubleOutMode() throws {
        setUp()
        defer { tearDown() }
        
        // Set score to 20 (can be won with double 10)
        viewModel.player1.currentScore = 20

        // Try to win with a non-double (should fail)
        viewModel.makeThrow(20)
        #expect(viewModel.gameState == .playing, "Game should not be won with a non-double")
        #expect(viewModel.player1.currentScore == 20, "Score should reset")
        #expect(viewModel.currentPlayer == viewModel.player2, "Player should switch")
        #expect(viewModel.currentThrowInTurn == 0, "Throws should be resetted")

        // Win with a double
        viewModel.currentPlayerIndex = 0
        viewModel.setMultiplier(.double)
        viewModel.makeThrow(10)
        #expect(viewModel.gameState == .finished(winner: player1))
    }

    @Test("Single out mode should work correctly")
    func testSingleOutMode() throws {
        setUp()
        defer { tearDown() }
        
        // Set score to 20 (can be won with single 20)
        settings.gameMode = .singleOut
        viewModel = GameViewModel(gameSettings: settings)
        viewModel.player1.currentScore = 20

        // Win with a single
        viewModel.makeThrow(20)
        #expect(viewModel.gameState == .finished(winner: player1))
    }

    @Test("Different game modes should work correctly")
    func testGameModes() throws {
        setUp()
        defer { tearDown() }
        
        // Test double-out mode
        viewModel.player1.currentScore = 40
        viewModel.makeThrow(20)
        viewModel.makeThrow(20)
        #expect(viewModel.player1.currentScore == 40, "Should not allow non-double finish in double-out mode")
        #expect(viewModel.currentPlayer == viewModel.player2, "Should switch player")

        // Change to single-out mode
        settings.gameMode = .singleOut
        viewModel = GameViewModel(gameSettings: settings)
        viewModel.player1.currentScore = 20
        viewModel.makeThrow(20)
        if case .finished(let winner) = viewModel.gameState {
            #expect(winner.id == player1.id, "Should allow single-out finish")
        }
    }
}
