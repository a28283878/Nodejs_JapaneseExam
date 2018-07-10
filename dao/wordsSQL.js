var WordsSQL = {  
    insert:'INSERT INTO words(word_type, word_japanese, word_chinese, user_id) VALUES(?, ?, ?, ?)',

    update:'UPDATE words SET word_type=?, word_japanese=?, word_chinese=?, user_id=? WHERE id = ? AND `delete` = 0',

    queryAll:`SELECT words.id, word_types.name as word_type, word_japanese, word_chinese, user_id 
    FROM words 
    LEFT JOIN word_types on(words.word_type = word_types.id)
    WHERE user_id=1 AND 'delete' = 0`,  

    getWordsByIdandUserId:`SELECT words.id, word_types.name as word_type, word_japanese, word_chinese, user_id 
    FROM words 
    LEFT JOIN word_types on(words.word_type = word_types.id)
    WHERE words.id = ? AND  user_id = ? AND 'delete' = 0`,

    deleteWordsById:'UPDATE words SET `delete` = 1 FROM words WHERE id = ? AND user_id = ?',
  };
module.exports = WordsSQL;