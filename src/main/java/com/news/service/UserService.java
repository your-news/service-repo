package com.news.service;

import com.news.dto.TokenDto;
import com.news.dto.user.LoginRequestDto;
import com.news.dto.user.LoginResponseDto;
import com.news.dto.user.UserRequestDto;
import com.news.entity.User;
import com.news.error.ErrorCode;
import com.news.error.exception.InvalidValueException;
import com.news.jwt.TokenProvider;
import com.news.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;

    @Transactional
    public void signup(UserRequestDto userRequestDto) {
        if (userRepository.existsByEmail(userRequestDto.getEmail())) {
            throw new InvalidValueException(ErrorCode.EMAIL_DUPLICATION);
        }
        if (userRepository.existsByNickname(userRequestDto.getNickname())) {
            throw new InvalidValueException(ErrorCode.NICKNAME_DUPLICATION);
        }

        User user = userRequestDto.toUser(passwordEncoder);
        userRepository.save(user);
    }

    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        User user = isPresentUser(loginRequestDto.getEmail());

        if (null == user) {
            throw new InvalidValueException(ErrorCode.LOGIN_INPUT_INVALID);
        }

        if (!user.validatePassword(passwordEncoder, loginRequestDto.getPassword())) {
            throw new InvalidValueException(ErrorCode.NOTEQUAL_INPUT_PASSWORD);
        }

        TokenDto tokenDto = tokenProvider.generateTokenDto(user);

        return LoginResponseDto.builder()
                .grantType(tokenDto.getGrantType())
                .accessToken(tokenDto.getAccessToken())
                .accessTokenExpiresIn(tokenDto.getAccessTokenExpiresIn())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .build();
    }

    @Transactional(readOnly = true)
    public User isPresentUser(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.orElse(null);
    }

    @Transactional
    public User getMyInfo() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || authentication.getName() == null) {
            throw new InvalidValueException(ErrorCode.LOGIN_INPUT_INVALID);
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new InvalidValueException(ErrorCode.NOT_FOUND_USER));
    }

    @Transactional
    public boolean existsByEmail(String email){
        return userRepository.existsByEmail(email);
    }
    @Transactional
    public boolean existsByNickname(String nickname){
        return userRepository.existsByNickname(nickname);
    }
}
