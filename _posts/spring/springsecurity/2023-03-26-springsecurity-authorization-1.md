---
title: "[인가] 권한 체크 내부 프로세스"
excerpt: "인가 처리를 위한 권한 체크 내부 프로세스 정리"

categories:
  - Spring Security
tags:
  - [tag1, tag2]

permalink: /spring-security/authorization-1/

toc: true
toc_sticky: true

date: 2023-03-26
last_modified_at: 2023-03-26
---

## 스프링 시큐리티 인가 처리

<img src="/assets/images/posts_img/springsecurity-authorization-1/role_to_map.png"></img>

인가 처리를 하기 위해서는 아래의 세가지 정보가 필요하다.
1. 사용자 - 인증 정보
   + Authencation 즉 Security Context 에서 인증 객체를 가져올 수 있다.
2. 자원 - 요청 정보
   + FilterInvocation 객체를 생성하고 request(/user) 정보를 저장한 다음 객체를 전달
3. 권한 - 권한 정보
   + DB에서 조회해온 권한 목록을 map(자원:권한)에 담고
   + /user 요청이 오면 해당 자원 키에 해당하는 권한을 map에서 찾아서 
   + ConfigAttribute 객체에 권한을 담아 List에 add 한다.
   + List<ConfigAttribute> 반환
   
최종적으로 요청이 들어오면 SecurityInterceptor 가 AccessDecisionManager 에게 3가지 정보로 인가 처리 요청을 한다.

### 권한 정보 추출
1. 시큐리티 초기화 떄 권한을 map에 담는다.
   + ExpressionBasedFilterInvocationSecurityMetadataSource 클래스에서 권한을 map에 담고
   + 이 클래스가 상속받고 있는 DefaultFilterInvocationSecurityMetadataSource 클래스의 getAttribute 메서드에서 권한을 추출한다.
2. 앞으로 DB를 조회하여 권한을 가져올 때 DefaultFilterInvocationSecurityMetadataSource 클래스의 getAttribute 메소드와 동일하게 작성하려 한다.
3. getAttribute를 사용하기 위해 SecurityMetadataSource 인터페이스를 구현하여 권한정보를 추출 한다.
   1. url 권한 정보 추출
      + FilterInvocationSecurityMetadataSource
   2. 메소드 권한 정보 추
      + MethodSecurityMetadataSource

<img src="/assets/images/posts_img/springsecurity/db_role.png"></img>


