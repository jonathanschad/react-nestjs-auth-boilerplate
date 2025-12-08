import SwiftUI

struct PlayerSelectionSheet: View {
    @ObservedObject var viewModel: GameSetupViewModel
    let excludedPlayer: Player?
    let onPlayerSelected: (Player?) -> Void
    
    @State private var searchText = ""
    @State private var showingAddPlayer = false
    @Environment(\.dismiss) private var dismiss
    
    var filteredPlayers: [Player] {
        if searchText.isEmpty {
            return viewModel.players
        } else {
            return viewModel.players.filter { player in
                player.name.localizedCaseInsensitiveContains(searchText)
            }
        }
    }
    
    var body: some View {
        NavigationStack {
            VStack {
                // Suchleiste
                SearchBar(searchText: $searchText)
                
                // Sort Picker
                Picker("Sortierung", selection: $viewModel.selectedSortOption) {
                    ForEach(Player.SortOption.allCases, id: \.self) { option in
                        Text(option.rawValue).tag(option)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                .padding(.bottom, DesignSystem.Spacing.sm)
                
                if viewModel.isLoading {
                    VStack {
                        ProgressView()
                            .controlSize(.large)
                        Text("Lade Spieler...")
                            .foregroundColor(DesignSystem.Colors.secondary)
                            .padding(.top, DesignSystem.Spacing.sm)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let error = viewModel.error {
                    VStack {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.largeTitle)
                            .foregroundColor(DesignSystem.Colors.error)
                        Text("Fehler beim Laden der Spieler")
                            .font(.headline)
                            .padding(.top, DesignSystem.Spacing.sm)
                        Text(error.localizedDescription)
                            .font(.subheadline)
                            .foregroundColor(DesignSystem.Colors.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, DesignSystem.Spacing.lg)
                        Button(action: {
                            Task {
                                await viewModel.loadPlayers()
                            }
                        }) {
                            Text("Erneut versuchen")
                                .font(.headline)
                        }
                        .buttonStyle(.borderedProminent)
                        .padding(.top, DesignSystem.Spacing.md)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List {
                        // Gefilterte Spielerliste
                        ForEach(filteredPlayers) { player in
                            PlayerListItem(
                                player: player,
                                isAlreadySelected: excludedPlayer == player,
                                onSelect: {
                                    if excludedPlayer != player {
                                        onPlayerSelected(player)
                                    }
                                }
                            )
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .navigationTitle("Spieler auswählen")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Abbrechen") {
                        dismiss()
                    }
                }
            }
        }
    }
}

// MARK: - Search Bar
private struct SearchBar: View {
    @Binding var searchText: String
    
    var body: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(DesignSystem.Colors.secondary)
            TextField("Spieler suchen", text: $searchText)
                .textFieldStyle(.plain)
        }
        .padding(.horizontal, DesignSystem.Spacing.md)
        .padding(.vertical, DesignSystem.Spacing.sm)
        .background(DesignSystem.Colors.systemGray6)
        .cornerRadius(DesignSystem.CornerRadius.small)
        .padding(.horizontal, DesignSystem.Spacing.md)
    }
}

// MARK: - Player List Item
private struct PlayerListItem: View {
    let player: Player
    let isAlreadySelected: Bool
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            HStack(spacing: DesignSystem.Spacing.md) {
                // Spieler Bild
                ZStack {
                    Circle()
                        .fill(isAlreadySelected ? DesignSystem.Colors.disabled.opacity(0.1) : DesignSystem.Colors.accent.opacity(0.1))
                        .frame(width: DesignSystem.Sizes.smallIcon, height: DesignSystem.Sizes.smallIcon)
                    
                    if player.profilePictureId != nil {
                        RemoteImageView(
                            fileId: player.profilePictureId,
                            placeholder: Image(systemName: "person.fill"),
                            size: CGSize(width: DesignSystem.Sizes.smallIcon, height: DesignSystem.Sizes.smallIcon)
                        )
                        .opacity(isAlreadySelected ? 0.5 : 1.0)
                    } else {
                        Image(systemName: "person.fill")
                            .font(.title3)
                            .foregroundColor(isAlreadySelected ? DesignSystem.Colors.disabled : DesignSystem.Colors.accent)
                    }
                }
                
                VStack(alignment: .leading, spacing: DesignSystem.Spacing.xxs) {
                    Text(player.name)
                        .foregroundColor(isAlreadySelected ? DesignSystem.Colors.disabled : DesignSystem.Colors.primary)
                        .fontWeight(.medium)
                    
                    if isAlreadySelected {
                        Text("Bereits für anderen Spieler ausgewählt")
                            .font(.caption)
                            .foregroundColor(DesignSystem.Colors.disabled)
                    }
                }
                
                Spacer()
                
                if isAlreadySelected {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundColor(DesignSystem.Colors.disabled)
                }
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(isAlreadySelected)
        .opacity(isAlreadySelected ? 0.6 : 1.0)
    }
}

// MARK: - Add Player Button
private struct AddPlayerButton: View {
    var body: some View {
        HStack {
            Image(systemName: "plus.circle.fill")
                .foregroundColor(DesignSystem.Colors.success)
            Text("Neuen Spieler hinzufügen")
                .foregroundColor(DesignSystem.Colors.success)
                .fontWeight(.medium)
            Spacer()
        }
    }
}

#Preview {
    PlayerSelectionSheet(
        viewModel: GameSetupViewModel(navigationCoordinator: NavigationCoordinator()),
        excludedPlayer: nil,
        onPlayerSelected: { _ in print("selected") }
    )
} 
