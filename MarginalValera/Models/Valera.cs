namespace MarginalValera.Models
{
    public class Valera
    {
        // public int Health { get; private set; } = 100;
        // public int Alcohol { get; private set; } = 0;
        // public int Cheerfulness { get; private set; } = 0;
        // public int Fatigue { get; private set; } = 0;
        // public decimal Money { get; private set; } = 0m;
        private int _Health = 100;
        private int _Alcohol = 0;
        private int _Cheerfulness = 0;
        private int _Fatigue = 0;
        private int _Money = 0;
        public int Health
        {
            get { return _Health; }
            private set { _Health = value; }
        }

        public int Alcohol
        {
            get { return _Alcohol; }
            private set { _Alcohol = value; }
        }

        public int Cheerfulness
        {
            get { return _Cheerfulness; }
            private set { _Cheerfulness = value; }
        }
        public int Fatigue
        {
            get { return _Fatigue; }
            private set { _Fatigue = value; }
        }

        public int Money
        {
            get { return _Money; }
            private set { _Money = value; }
        }
        //private int Clamp(int value, int min, int max) => Math.Min(Math.Max(value, min), max);
        private int Clamp(int value, int min, int max) 
        {
            return Math.Min(Math.Max(value, min), max);
        }
        public bool GoToWork()
        {
            if (_Alcohol >= 50 || _Fatigue >= 10) return false;
            _Cheerfulness = Clamp(_Cheerfulness - 5, -10, 10);
            _Alcohol = Clamp(_Alcohol - 10, 0, 100);
            _Money += 100;
            _Fatigue = Clamp(_Fatigue + 70, 0, 100);
            return true;
        }
        public void EnjoyNature()
        {
            _Cheerfulness = Clamp(_Cheerfulness + 1, -10, 10);
            _Alcohol = Clamp(_Alcohol - 10, 0, 100);
            _Fatigue = Clamp(_Fatigue + 10, 0, 100);
        }
        public bool DrinkWineAndWatchSeries()
        {
            if (_Money < 20) return false;
            _Cheerfulness = Clamp(_Cheerfulness - 1, -10, 10);
            _Alcohol = Clamp(_Alcohol + 10, 0, 100);
            _Fatigue = Clamp(_Fatigue + 10, 0, 100);
            _Health = Clamp(_Fatigue - 5, 0, 100);
            _Money -= 20;
            return true;
        }
        public bool GoToBar()
        {
            if (_Money < 100) return false;
            _Cheerfulness = Clamp(_Cheerfulness + 1, -10, 10);
            _Alcohol = Clamp(_Alcohol + 60, 0, 100);
            _Fatigue = Clamp(_Fatigue + 40, 0, 100);
            _Health = Clamp(_Fatigue - 10, 0, 100);
            _Money -= 100;
            return true;
        }
        public bool DrinkWithMarginals()
        {
            if (_Money < 150) return false;
            _Cheerfulness = Clamp(_Cheerfulness + 5, -10, 10);
            _Health = Clamp(_Fatigue - 80, 0, 100);
            _Alcohol = Clamp(_Alcohol + 90, 0, 100);
            _Fatigue = Clamp(_Fatigue + 80, 0, 100);
            _Money -= 150;
            return true;
        }
        public void SingInMetro()
        {
            _Cheerfulness = Clamp(_Cheerfulness + 1, -10, 10);
            _Alcohol = Clamp(_Alcohol + 10, 0, 100);
            _Fatigue = Clamp(_Fatigue + 20, 0, 100);
            _Money += 10;
            if ((_Alcohol > 40) & (_Alcohol < 70))
                _Money += 50;
        }
        public void Sleep()
        {
            if (_Alcohol < 30)
                _Health = Clamp(_Health + 90, 0, 100);
            if (_Alcohol > 70)
                _Cheerfulness = Clamp(_Cheerfulness - 3, -10, 10);
            _Alcohol = Clamp(_Alcohol - 50, 0, 100);
            _Fatigue = Clamp(_Fatigue - 70, 0, 100);
        }
    }

}