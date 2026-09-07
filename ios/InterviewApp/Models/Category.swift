import Foundation

public struct LocalizedCategoryContent: Codable, Hashable {
    public let name: String
    public let description: String?
    
    public init(name: String, description: String? = nil) {
        self.name = name
        self.description = description
    }
}

public struct Category: Identifiable, Codable, Hashable {
    public let id: String
    public let slug: String
    public let icon: String
    public let displayOrder: Int
    public let tr: LocalizedCategoryContent
    public let en: LocalizedCategoryContent
    
    public init(
        id: String,
        slug: String,
        icon: String,
        displayOrder: Int,
        tr: LocalizedCategoryContent,
        en: LocalizedCategoryContent
    ) {
        self.id = id
        self.slug = slug
        self.icon = icon
        self.displayOrder = displayOrder
        self.tr = tr
        self.en = en
    }
    
    public func content(for lang: AppLanguage) -> LocalizedCategoryContent {
        return lang == .en ? en : tr
    }
}
