var store = [{
        "title": "[포스팅 예시] 이곳에 제목을 입력하세요",
        "excerpt":"🦥 본문   본문은 여기에 …  ","categories": ["Query DSL"],
        "tags": ["tag1","tag2"],
        "url": "/query-dsl/post-1/",
        "teaser": null
      },{
        "title": "[포스팅 예시] 이곳에 제목을 입력하세요",
        "excerpt":"🦥 본문   본문은 여기에 …  ","categories": ["Spring Data JPA"],
        "tags": ["tag1","tag2"],
        "url": "/spring-data-jpa/post-1/",
        "teaser": null
      },{
        "title": "[포스팅 예시] 이곳에 제목을 입력하세요",
        "excerpt":"🦥 본문   본문은 여기에 …  ","categories": ["Spring Oauth"],
        "tags": ["tag1","tag2"],
        "url": "/spring-oauth/post-1/",
        "teaser": null
      },{
        "title": "[인가] 권한 체크 내부 프로세스",
        "excerpt":"스프링 시큐리티 인가 처리 인가 처리를 하기 위해서는 아래의 세가지 정보가 필요하다. 사용자 - 인증 정보 Authencation 즉 Security Context 에서 인증 객체를 가져올 수 있다. 자원 - 요청 정보 FilterInvocation 객체를 생성하고 request(/user) 정보를 저장한 다음 객체를 전달 권한 - 권한 정보 DB에서 조회해온 권한 목록을 map(자원:권한)에 담고 /user...","categories": ["Spring Security"],
        "tags": ["tag1","tag2"],
        "url": "/springsecurity/authorization/1/",
        "teaser": null
      },{
        "title": "인가 프로세스 DB 연동 (1)",
        "excerpt":"[DB 연동] Url 권한 체크 FilterInvocationSecurityMetadataSource 최상위 인터페이스 SecurityMetadataSource 를 상속받은 UrlFilterInvocationSecurityMetadataSource 클래스를 만들어서 getAttributes 메소드를 구현 사용자가 uri(리소스)로 요청 인가를 처리하는 FilterSecurityInterceptor 가 요청을 받음 인가를 처리하기 위해 권한을 조회 FilterInvocationSecurityMetadataSource 에서 Map에 저장된 권한 정보를 추출 리소스에 해당하는 권한을 가지고 있으면 AccessDecisionManager 에 전달 리소스에 해당하는 권한이 없으면...","categories": ["Spring Security"],
        "tags": ["tag1","tag2"],
        "url": "/springsecurity/authorization/2/",
        "teaser": null
      },{
        "title": "인가 프로세스 DB 연동 (2)",
        "excerpt":"[DB 연동] Url 권한 체크 1. UrlResourcesMapFactoryBean DB로 부터 얻은 권한/자원 정보를 ResourceMap 빈으로 생성해서 이전 시간에 만든 필터인 UrlFilterInvocationSecurityMetadataSource 에 전달 UrlResourcesMapFactoryBean 클래스를 생성하고 public class UrlResourcesMapFactoryBean implements FactoryBean&lt;LinkedHashMap&lt;RequestMatcher, List&lt;ConfigAttribute&gt;&gt;&gt; { private SecurityResourceService securityResourceService; private LinkedHashMap&lt;RequestMatcher, List&lt;ConfigAttribute resourceMap; public void setSecurityResourceService(SecurityResourceService securityResourceService) { this.securityResourceService = securityResourceService; } @Override public...","categories": ["Spring Security"],
        "tags": ["tag1","tag2"],
        "url": "/springsecurity/authorization/3/",
        "teaser": null
      },{
        "title": "인가 처리 실시간 반영",
        "excerpt":"[DB 연동] 인가 처리 실시간 반영 DB 데이터의 권한/리소스 정보가 변경되었을 경우 변경된 권한/리소스로 실시간 반영하여 인가 처리한다. UrlFilterInvocationSecurityMetadataSource 클래스에 변경된 권한/리소스를 실시간 반영할 reload 메서드 생성 public void reload() { LinkedHashMap&lt;RequestMatcher, List&lt;ConfigAttribute&gt;&gt; reloadedMap = securityResourceService.getResourceList(); Iterator&lt;Map.Entry&lt;RequestMatcher, List&lt;ConfigAttribute&gt;&gt;&gt; iterator = reloadedMap.entrySet().iterator(); requestMap.clear(); while (iterator.hasNext()) { Map.Entry&lt;RequestMatcher, List&lt;ConfigAttribute&gt;&gt; entry = iterator.next();...","categories": ["Spring Security"],
        "tags": ["tag1","tag2"],
        "url": "/springsecurity/authorization/4/",
        "teaser": null
      },{
        "title": "인증/권한 체크없이 리소스 접근",
        "excerpt":"PermitAllFilter 구현 기존 인가 프로세스 사용자 요청이 오면 FilterSecurityInterceptor 가 받고 invoke 메서드에서 부모 클래스 AbstractSecurityInterceptor 에 인가처리를 맡김 권한 목록인 List&lt;ConfigAttribute&gt; 가 null 이면 권한 심사 없이 바로 통과 null 이 아니면 AccessDecisionManager 가 권한 심사 PermitAllFilter 처리 프로세스 사용자 요청이 오면 FilterSecurityInterceptor 를 상속받은 PermitAllFilter 가 받고 인증/권한...","categories": ["Spring Security"],
        "tags": ["tag1","tag2"],
        "url": "/springsecurity/authorization/5/",
        "teaser": null
      },{
        "title": "달리기 경주",
        "excerpt":"문제 풀이 import java.util.*; class Solution { public String[] solution(String[] players, String[] callings) { String[] answer = {}; // 현재 순위 저장 Map&lt;String, Object&gt; playerMap = new HashMap&lt;&gt;(); for (int i=0; i&lt;players.length; ++i) { playerMap.put(players[i], i); } // 추월한 횟수 for (String name : callings) { // 추월하기 전 현재...","categories": ["Programmers"],
        "tags": ["tag1","tag2"],
        "url": "/algorithm/level1/1/",
        "teaser": null
      }]
