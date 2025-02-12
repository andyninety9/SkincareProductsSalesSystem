using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Linq;
using System.Security.Claims;
using Application.Abstractions.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Application.Common.Enum;

namespace Application.Attributes
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class AuthorizeRoleAttribute : Attribute, IAuthorizationFilter
    {
        private readonly RoleAccountEnum[] _requiredRoles;

        public AuthorizeRoleAttribute(params RoleAccountEnum[] requiredRoles)
        {
            _requiredRoles = requiredRoles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            // Kiểm tra người dùng đã xác thực chưa
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedResult(); // 401 Unauthorized
                return;
            }

            // Lấy RoleId từ JWT Token
            var roleIdClaim = user.Claims.FirstOrDefault(c => c.Type == "roleId")?.Value;
            if (string.IsNullOrEmpty(roleIdClaim) || !Enum.TryParse<RoleAccountEnum>(roleIdClaim, out var userRole))
            {
                context.Result = new ForbidResult(); // 403 Forbidden
                return;
            }

            // Lấy AuthorizationService từ DI
            var authorizationService = context.HttpContext.RequestServices.GetRequiredService<IAuthorizationService>();
            if (authorizationService == null)
            {
                throw new InvalidOperationException("IAuthorizationService is not registered in the DI container.");
            }

            // Kiểm tra nếu RoleId không nằm trong danh sách yêu cầu
            if (!_requiredRoles.Contains(userRole))
            {
                context.Result = new ForbidResult(); // 403 Forbidden
            }
        }
    }
}
