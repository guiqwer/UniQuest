package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.PasswordResetToken;
import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.UserProfileAvatarDTO;
import com.Uniquest.UniQuest.dto.UserProfileDTO;
import com.Uniquest.UniQuest.repositories.PasswordResetTokenRepository;
import com.Uniquest.UniQuest.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    public void createPasswordResetTokenForUser(User user, String token) {
        PasswordResetToken mytoken = new PasswordResetToken(token, user);
        passwordResetTokenRepository.save(mytoken);
    }

    //Método para atualizar o perfil do usuário
    public User updateUserProfile(Long userID, UserProfileDTO updateUserProfile) {
        //verificar se o usuário tem um perfil
        Optional<User> optinalUserProfile = User.findById(userID);
        if(optinalUserProfile.isPresent()) {
            User userProfile = optinalUserProfile.get();
            //Atualizar os campos conforme necessário
            userProfile.setEducation(updateUserProfile.education());
            userProfile.setFavoriteSubject(updateUserProfile.favoriteSubject());
            userProfile.setAreaOfInterest(updateUserProfile.areaOfInterest());
            return User.save(userProfile);
        } else {
            throw new RuntimeException("Perfil não encontrado para o usuário com ID" + userID);
        }
    }


    //Método para dar upload no avatar.
    public User updateUserAvatar(Long userID, UserProfileAvatarDTO avatarFileDTO) {
        Optional<User> optionalUserProfile = User.findById(userID);
        if (optionalUserProfile.isPresent()) {
            User userProfile = optionalUserProfile.get();
            try {
                // Obtém os bytes do arquivo MultipartFile a partir do DTO
                byte[] avatarBytes = avatarFileDTO.avatarFile().getBytes();
                userProfile.setAvatar(avatarBytes); // Converte a imagem para bytes
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar a imagem", e);
            }
            return User.save(userProfile);
        } else {
            throw new RuntimeException("Perfil não encontrado para o usuário com ID " + userID);
        }
    }

    //Metodo para deleter avatar.
    public void deleteUserAvatar(Long userID) {
        User userProfile = User.findById(userID)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
        // Definir o avatar como null para "deletar" o avatar
        userProfile.setAvatar(null);
        // Salvar as alterações no banco de dados
        User.save(userProfile);
    }

}
