using System.Reflection;
using MarginalValera.Models;
using Xunit;

public class ValeraTests
{
    [Fact]
    public void Work_ShouldIncreaseMoney_IfAllowed()
    {
        var v = new Valera();
        var res = v.GoToWork();
        Assert.True(res);
        Assert.Equal(100, v.Money);
    }

    [Fact]
    public void Work_ShouldNotWork_IfTooDrunk()
    {
        var v = new Valera();
        for(int i=0; i<100; i++) v.SingInMetro();
        var res = v.GoToWork();
        Assert.False(res);
    }

    [Fact]
    public void Sleep_ShouldRestoreHealth_WhenSober()
    {
        var v = new Valera();
        v.Sleep();
        Assert.Equal(100, v.Health);
    }

    [Fact]
    public void DrinkWithMarginals_ShouldNotSpendMoney_IfNotEnough()
    {
        var v = new Valera(); // Money = 0
        var res = v.DrinkWithMarginals();
        Assert.False(res);
        Assert.Equal(0, v.Money);
        Assert.Equal(0, v.Alcohol); // Ничего не изменилось
    }

    [Fact]
    public void GoToBar_ShouldNotSpendMoney_IfNotEnough()
    {
        var v = new Valera(); // Money = 0
        var res = v.GoToBar();
        Assert.False(res);
        Assert.Equal(0, v.Money);
        Assert.Equal(0, v.Alcohol);
    }

    [Fact]
    public void DrinkWineAndWatchSeries_ShouldNotSpendMoney_IfNotEnough()
    {
        var v = new Valera(); // Money = 0
        var res = v.DrinkWineAndWatchSeries();
        Assert.False(res);
        Assert.Equal(0, v.Money);
        Assert.Equal(0, v.Alcohol);
    }

    [Fact]
    public void CanSpendMoney_WhenEnough()
    {
        var v = new Valera();
        var v2 = new Valera();
        var v3 = new Valera();
        v.GoToWork(); // +100
        v.DrinkWineAndWatchSeries();
        Assert.Equal(80, v.Money);

        var res = v2.GoToWork();
        Assert.True(res);
        Assert.Equal(70, v2.Fatigue);
        v2.Sleep();
        var res2 = v2.GoToWork();
        Assert.True(res2);

        Assert.Equal(200, v2.Money);
        var res3 = v2.GoToBar();
        Assert.True(res3);
        Assert.Equal(100, v2.Money);

        v3.GoToWork();
        v3.Sleep();
        v3.GoToWork();
        v3.DrinkWithMarginals();
        Assert.Equal(50, v3.Money);
        
        
    }
}
