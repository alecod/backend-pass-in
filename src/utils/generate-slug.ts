export function generateSlug (text: string): string {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Mantém caracteres alfanuméricos, espaços e hífens
        .replace(/\s+/g, "-") // Substitui espaços por hífens
        .replace(/^-+|-+$/g, ""); // Remove hífens do início e do final
}