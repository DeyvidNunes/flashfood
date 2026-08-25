package com.flashfood.flashfood.config;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;

import com.flashfood.flashfood.model.Usuario;

@Service
public class JwtService {

    private final SecretKey chave = Jwts.SIG.HS256.key().build();
    private final long validadeMs = 1000 * 60 * 60 * 8; // 8 horas

    public String gerarToken(Usuario usuario) {
        return Jwts.builder()
            .subject(usuario.getEmail())
            .claim("id", usuario.getId())
            .claim("tipo", usuario.getTipoUsuario())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + validadeMs))
            .signWith(chave)
            .compact();
    }

    public String extrairEmail(String token) {
        return Jwts.parser().verifyWith(chave).build()
            .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser().verifyWith(chave).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}