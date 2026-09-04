import Foundation

public struct Category: Identifiable, Codable, Hashable {
    public let id: UUID
    public let name: String
    public let slug: String
    public let icon: String
    public let description: String?
    public let displayOrder: Int
    
    enum CodingKeys: String, CodingKey {
        case id, name, slug, icon, description
        case displayOrder = "display_order"
    }
}
