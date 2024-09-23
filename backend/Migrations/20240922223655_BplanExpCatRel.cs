using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class BplanExpCatRel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BudgetPlans_Users_UserId",
                table: "BudgetPlans");

            migrationBuilder.DropIndex(
                name: "IX_BudgetPlans_UserId",
                table: "BudgetPlans");

            migrationBuilder.DropColumn(
                name: "Details",
                table: "BudgetPlans");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "BudgetPlans",
                newName: "ExpenseCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_BudgetPlans_ExpenseCategoryId",
                table: "BudgetPlans",
                column: "ExpenseCategoryId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_BudgetPlans_ExpenseCategories_ExpenseCategoryId",
                table: "BudgetPlans",
                column: "ExpenseCategoryId",
                principalTable: "ExpenseCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BudgetPlans_ExpenseCategories_ExpenseCategoryId",
                table: "BudgetPlans");

            migrationBuilder.DropIndex(
                name: "IX_BudgetPlans_ExpenseCategoryId",
                table: "BudgetPlans");

            migrationBuilder.RenameColumn(
                name: "ExpenseCategoryId",
                table: "BudgetPlans",
                newName: "UserId");

            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "BudgetPlans",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_BudgetPlans_UserId",
                table: "BudgetPlans",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BudgetPlans_Users_UserId",
                table: "BudgetPlans",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
