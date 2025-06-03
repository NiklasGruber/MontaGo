using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MontagGo.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MontagGo.API.Services
{
    public class JwtTokenGenerator
    {
        private readonly JwtSettings _settings;
        private readonly AppDbContext _context;

        public JwtTokenGenerator(IOptions<JwtSettings> options, AppDbContext context)
        {
            _settings = options.Value;
            _context = context;
        }

        public string GenerateToken(string username)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == username || u.Email == username);

            if (user == null)
                throw new Exception("User not found");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role ?? "User"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_settings.ExpiryMinutes),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
