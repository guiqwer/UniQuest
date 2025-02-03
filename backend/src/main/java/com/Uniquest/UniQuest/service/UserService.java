package com.Uniquest.UniQuest.service;

import com.Uniquest.UniQuest.domain.user.User;
import com.Uniquest.UniQuest.dto.UserProfileAvatarDTO;
import com.Uniquest.UniQuest.dto.UserEditProfileDTO;
import com.Uniquest.UniQuest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //Método para atualizar o perfil do usuário
    public User updateUserProfile(String userID, UserEditProfileDTO updateUserProfile) {
        Optional<User> optionalUser = userRepository.findById(userID);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setEducation(updateUserProfile.education());
            user.setFavoriteSubject(updateUserProfile.favoriteSubject());
            user.setAreaOfInterest(updateUserProfile.areaOfInterest());
            return userRepository.save(user); // Salva no banco de dados
        } else {
            throw new RuntimeException("Perfil não encontrado para o usuário com ID " + userID);
        }
    }

    //Método para dar upload no avatar.
    public User updateUserAvatar(String userID, UserProfileAvatarDTO avatarFileDTO) {
        Optional<User> optionalUserProfile = userRepository.findById(userID);

        if (optionalUserProfile.isPresent()) {
            User userProfile = optionalUserProfile.get();
            try {
                // Obtém os bytes do arquivo MultipartFile a partir do DTO
                byte[] avatarBytes = avatarFileDTO.avatarFile().getBytes();
                userProfile.setAvatar(avatarBytes); // Converte a imagem para bytes
            } catch (IOException e) {
                throw new RuntimeException("Erro ao processar a imagem", e);
            }

            // Salva o usuário atualizado no banco de dados
            return userRepository.save(userProfile);
        } else {
            throw new RuntimeException("Perfil não encontrado para o usuário com ID " + userID);
        }
    }

    public void deleteUserAvatar(String userID) {
        User userProfile = userRepository.findById(userID)
                .orElseThrow(() -> new RuntimeException("Perfil não encontrado"));
        // Definir o avatar como null para "deletar" o avatar
        userProfile.setAvatar(null);
        // Salvar as alterações no banco de dados
        userRepository.save(userProfile);
    }

}
