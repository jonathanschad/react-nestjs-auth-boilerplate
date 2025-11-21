import SwiftUI

struct BoxingIntroView: View {
    @State private var rotation: Double = 0.0
    var foreverAnimation: Animation {
        Animation.linear(duration: 2.0)
            .repeatForever(autoreverses: false)
    }
    let player1: String
    let player2: String
    let imageAspectRatio: CGFloat = 768.0 / 887.0

    var body: some View {
        GeometryReader { geometry in
            let containerWidth = geometry.size.width
            let containerHeight = geometry.size.height

            let (imageWidth, imageHeight): (CGFloat, CGFloat) = {
                if containerWidth / containerHeight > imageAspectRatio {
                    let height = containerHeight
                    let width = height * imageAspectRatio
                    return (width, height)
                } else {
                    let width = containerWidth
                    let height = width / imageAspectRatio
                    return (width, height)
                }
            }()

            let xOffset = (containerWidth - imageWidth) / 2
            let yOffset = (containerHeight - imageHeight) / 2

            ZStack {
                Image("IntroSpinner")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .rotationEffect(.degrees(rotation))
                    .animation(foreverAnimation, value: true)
                Image("IntroGraphic")
                    .resizable()
                    .aspectRatio(imageAspectRatio, contentMode: .fit)

                Text(player1)
                    .foregroundColor(.white)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .position(
                        x: xOffset + imageWidth * 0.22,
                        y: yOffset + imageHeight * 0.223
                    )

                Text(player2)
                    .foregroundColor(.white)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .position(
                        x: xOffset + imageWidth * 0.78,
                        y: yOffset + imageHeight * 0.223
                    )
            }
            .frame(width: containerWidth, height: containerHeight, alignment: .center)
        }
        .frame(minWidth: 0, maxWidth: .infinity,
               minHeight: 0, maxHeight: .infinity)
        .background(DesignSystem.Colors.groupedBackground) // Optional debug background
        .onAppear {
            withAnimation(.linear(duration: 1)
                .speed(0.1).repeatForever(autoreverses: false)) {
                    rotation = 360.0
                }
        }
    }
}


#Preview {
    BoxingIntroView(player1: "Hannibal", player2: "Lars")
}
