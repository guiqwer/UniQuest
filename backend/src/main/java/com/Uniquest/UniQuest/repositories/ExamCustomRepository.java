package com.Uniquest.UniQuest.repositories;

import com.Uniquest.UniQuest.domain.exam.Exam;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


@Repository
public class ExamCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Exam> findByFilters(String title, String description, List<String> tags) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Exam> query = cb.createQuery(Exam.class);
        Root<Exam> root = query.from(Exam.class);

        List<Predicate> predicates = new ArrayList<>();

        if (title != null && !title.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
        }

        if (description != null && !description.isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("description")), "%" + description.toLowerCase() + "%"));
        }

        if (tags != null && !tags.isEmpty()) {
            Join<Exam, String> tagsJoin = root.join("tags", JoinType.INNER); // Usa INNER JOIN para evitar exames sem tags
            List<Predicate> tagPredicates = new ArrayList<>();

            for (String tag : tags) {
                String likePattern = "%" + tag.toLowerCase() + "%";
                tagPredicates.add(cb.like(cb.lower(tagsJoin), likePattern));
            }

            //Vai combinar as condições das tags com OR (qualquer tag parcialmente correspondente)
            predicates.add(cb.or(tagPredicates.toArray(new Predicate[0])));
        }

        if (!predicates.isEmpty()) {
            query.where(cb.or(predicates.toArray(new Predicate[0])));
        }
        return entityManager.createQuery(query).getResultList();
    }


}