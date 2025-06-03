using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MontagGo.API.Models;
using MontagGo.API.Request;
using MontagGo.API.Response;
using MontagGo.API.Services;
using AutoMapper;
using MontagGo.API.DTOs;
using MontagGo.API.DbModels;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher _passwordHasher;
    private readonly JwtTokenGenerator _tokenGenerator;
    private readonly IMapper _mapper;

    public AuthController(AppDbContext context, PasswordHasher passwordHasher, JwtTokenGenerator tokenGenerator, IMapper mapper)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
        _mapper = mapper;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] MyLoginRequest request)
    {
        // Benutzer anhand Username oder Email finden (du kannst beides zulassen)
        var user = await _context.Users
            .SingleOrDefaultAsync(u => u.Username == request.Username || u.Email == request.Username);

        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        // Passwort prüfen
        var passwordValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt);
        if (!passwordValid)
            return Unauthorized(new { message = "Invalid credentials" });

        // Token generieren
        var token = _tokenGenerator.GenerateToken(user.Username);

        // Optionally return user DTO with token
        var userDto = _mapper.Map<UserDto>(user);

        return Ok(new LoginResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] MyRegisterRequest request)
    {
        // Eingabevalidierung durch DataAnnotations läuft automatisch im Hintergrund

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // E-Mail bereits vergeben?
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest(new { message = "A user with this email already exists." });

        // Username bereits vergeben?
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return BadRequest(new { message = "Username is already taken." });

        // Passwort hashen
        _passwordHasher.CreatePasswordHash(request.Password, out var hash, out var salt);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = hash,
            PasswordSalt = salt,
            Role = "User" // Defaultrolle
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful." });
    }
}
