package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.common.ResponseDTO;
import com.Uniquest.UniQuest.dto.user.UserProfileAvatarDTO;
import com.Uniquest.UniQuest.dto.user.UserEditProfileDTO;
import com.Uniquest.UniQuest.dto.user.UserProfileDTO;
import com.Uniquest.UniQuest.exceptions.ImageProcessingException;
import com.Uniquest.UniQuest.exceptions.UserNotFoundException;
import com.Uniquest.UniQuest.infra.security.SecurityConfig;
import com.Uniquest.UniQuest.infra.security.TokenService;
import com.Uniquest.UniQuest.repositories.UserRepository;
import com.Uniquest.UniQuest.utils.GenerateRandomCodeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SecurityConfig securityConfig;
    private final EmailService emailService;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;


    public ResponseDTO confirmUserRegister(String email, String code, String name, String password) {
        Optional<User> user = this.userRepository.findByEmail(email);
        User existingUser = user.get();
        if (existingUser.getConfirmationCode().equals(code)) {
            existingUser.setPassword(passwordEncoder.encode(password));
            existingUser.setName(name);
            existingUser.setConfirmed(true);
            this.userRepository.save(existingUser);
            String token = this.tokenService.generateToken(existingUser);
            return new ResponseDTO(existingUser.getName(), token);
        } else {
            throw new UserNotFoundException("Código Inválido.");
        }
    }

    public void preConfirmUser(String email){
        String confirmationCode = GenerateRandomCodeUtil.generateRandomCode();
        emailService.sendConfirmEmail(email, confirmationCode);
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setConfirmationCode(confirmationCode);
        newUser.setConfirmed(false);
        this.userRepository.save(newUser);
    }

    //Método para atualizar o perfil do usuário
    public User updateUserProfile(String userID, UserEditProfileDTO updateUserProfile) {
        Optional<User> optionalUser = userRepository.findById(userID);
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("Perfil não encontrado para o usuário com ID " + userID);
        }

        User user = optionalUser.get();

            user.setUsername(updateUserProfile.username());
        user.setEducation(updateUserProfile.education());
        user.setFavoriteSubject(updateUserProfile.favoriteSubject());
        user.setAreaOfInterest(updateUserProfile.areaOfInterest());

        if (updateUserProfile.oldPassword() != null && updateUserProfile.newPassword() != null) {
            if (updateUserProfile.oldPassword().isBlank() || updateUserProfile.newPassword().isBlank()) {
                throw new IllegalArgumentException("As senhas não podem estar em branco.");
            }

            if (!securityConfig.passwordEncoder().matches(updateUserProfile.oldPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Senha antiga incorreta.");
            }

            user.setPassword(securityConfig.passwordEncoder().encode(updateUserProfile.newPassword()));
        }

        return userRepository.save(user);
    }

    public ResponseEntity<Void> updateUserAvatar(String userID, UserProfileAvatarDTO avatarFileDTO) {
        Optional<User> optionalUserProfile = userRepository.findById(userID);
        if (optionalUserProfile.isPresent()) {
            User userProfile = optionalUserProfile.get();
            try {
                byte[] avatarBytes = avatarFileDTO.avatarFile().getBytes();
                userProfile.setAvatar(avatarBytes);
            } catch (IOException e) {
                throw new ImageProcessingException("Erro ao processar a imagem para o usuário com ID " + userProfile.getId());
            }
            userRepository.save(userProfile);
            return ResponseEntity.noContent().build();
        } else {
            throw new UserNotFoundException("Perfil não encontrado para o usuário com ID " + userID);
        }
    }


    public void deleteUserAvatar(String userID) {
        User userProfile = userRepository.findById(userID)
                .orElseThrow(() -> new UserNotFoundException("Perfil não encontrado para o usuário com ID " + userID));;
        // Definir o avatar como null para "deletar" o avatar
        userProfile.setAvatar(null);
        // Salvar as alterações no banco de dados
        userRepository.save(userProfile);
    }

    public UserProfileDTO getUserById(String id){
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Usuário não encontrado."));

        return new UserProfileDTO(
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getEducation(),
                user.getAreaOfInterest(),
                user.getFavoriteSubject(),
                user.getAvatar()
        );
    }
}
