package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)
/*
哈希密码
*/
func HashPassword(pwd string) (string,error){
	hash,err:=bcrypt.GenerateFromPassword([]byte(pwd),12)
	return string(hash),err
}

/*
生成 JWT
*/
func GenrateJWT(username,role string) (string,error){
	token:=jwt.NewWithClaims(jwt.SigningMethodHS256,jwt.MapClaims{
		"username":username,
		"role":role,
		"exp":time.Now().Add(time.Hour*72).Unix(),
	})

	signedToken,err:=token.SignedString([]byte("secret"))
	return "Bearer "+signedToken,err
}

/*
验证密码
*/
func CheckPassword(password,hashedPwd string) bool{
	err:=bcrypt.CompareHashAndPassword([]byte(hashedPwd),[]byte(password))
	return err==nil
}

func ParseJWT(tokenString string) (string,string,error){
	if len(tokenString)>7&&tokenString[:7]=="Bearer "{
		tokenString=tokenString[7:]
	}
	
	token,err:=jwt.Parse(tokenString,func(token *jwt.Token) (interface{},error){
		if _,ok:=token.Method.(*jwt.SigningMethodHMAC);!ok{
			return nil,errors.New("unexpected signing method")
		}
		return []byte("secret"),nil
	})

	if err!=nil{
		return "", "",err
	}

	if claims,ok:=token.Claims.(jwt.MapClaims);ok && token.Valid{
		username,ok:=claims["username"].(string)
		if !ok{
			return "", "",errors.New("username claim is not a string")
		}
		role,ok:=claims["role"].(string)
		if !ok{
			return "", "",errors.New("role claim is not a string")
		}
		return username,role,nil
	}

	return "", "",err
}