package auth

import (
	"fmt"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"max.com/max/server/pkg/utils"
)

var privateKey = []byte(utils.GetDefEnv("SERVER_PRIVATE_KEY", string("1234"))) //utils.GenerateRandomBytes(128)

func JwtVerify(tokenString string) (userId int64, err error) {
	token, err := jwt.ParseWithClaims(tokenString, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return privateKey, nil
	})

	if err != nil {
		fmt.Println(err)
		return -1, ErrUnauth
	}

	return JwGetUser(token)
}

func JwGetUser(token *jwt.Token) (userId int64, err error) {
	if !token.Valid {
		return -1, jwt.ErrTokenMalformed
	}
	if claims, ok := token.Claims.(*jwt.RegisteredClaims); ok {
		return strconv.ParseInt(claims.ID, 10, 64)
	} else {
		return -1, jwt.ErrTokenInvalidClaims
	}
}

func JwtCreate(userId int64, username string) (token string, err error) {

	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(72 * time.Hour)),
		Issuer:    username,
		ID:        strconv.FormatInt(userId, 10),
	}

	// Create token
	tokenStruct := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Generate encoded token and send it as response.
	return tokenStruct.SignedString(privateKey)
}

func GetSecretKey() []byte {
	return privateKey
}
