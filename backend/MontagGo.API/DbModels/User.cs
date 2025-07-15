namespace MontagGo.API.DbModels
{
    public class User : TrackableEntity
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        // Sicherer Passwort-Hash + Salt
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        // Optional: Rollen oder Rechte
        public string? Role { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
