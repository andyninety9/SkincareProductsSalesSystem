using System;
using System.Linq;
using AutoMapper;
using Application.Features.Users.Response;
using Application.Features.Products.Response;
using Domain.Entities;
using Domain.DTOs;
using Application.Features.Orders.Response;

namespace Application.Common.Mapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Mapping cho User
            CreateMap<GetMeResponse, User>();
            CreateMap<User, GetMeResponse>();
            CreateMap<User, GetAllUsersResponse>();
            CreateMap<GetAllUsersResponse, User>();

            // Mapping for Order
            CreateMap<Order, ChangeOrderStatusResponse>();
            CreateMap<ChangeOrderStatusResponse, Order>();

            CreateMap<User, GetAllUsersResponse>()
                .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Usr.Role.RoleId))
                .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.Usr.AccStatusId))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.Usr.Username))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => MapGender(src.Gender)))
                .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.Dob.HasValue ? src.Dob.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null))
                .ForMember(dest => dest.RewardRank, opt => opt.MapFrom(src => MapRewardRank(src.RewardPoint)));

            // Mapping cho Product với đầy đủ thông tin liên quan
            CreateMap<Product, GetAllProductsResponse>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.BrandName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Cate.CateProdName))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.ProdStatus.ProdStatusName))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ProductImages.Select(i => i.ProdImageUrl).ToList()))
                .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Reviews.Count()));

            CreateMap<GetAllProductsResponse, Product>();

            // Mapping cho ProductImage nếu cần
            CreateMap<ProductImage, string>().ConvertUsing(src => src.ProdImageUrl);
            CreateMap<Product, GetProductResponse>()
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand.BrandName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Cate.CateProdName))
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.ProdStatus.ProdStatusName))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ProductImages.Select(i => i.ProdImageUrl).ToList()))
                .ForMember(dest => dest.ReviewCount, opt => opt.MapFrom(src => src.Reviews.Count()));
            // Mapping cho Review
            CreateMap<Review, GetAllProductReviewsResponse>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UsrId));

        }

        private static string MapGender(short? gender)
        {
            return gender switch
            {
                1 => "Male",
                2 => "Female",
                _ => "Other"
            };
        }

        private static string MapRewardRank(short rewardPoint)
        {
            return rewardPoint switch
            {
                < 250 => "Bronze",
                >= 250 and < 1500 => "Silver",
                _ => "Gold"
            };
        }
    }
}
